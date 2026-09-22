import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { AxiosError, AxiosRequestConfig, Method } from 'axios';
import api from './axiosInstance';
import { PAGE_SIZE, STATUS_TRANSITIONS } from '../app/constants';
import type {
    CreateOrderBody,
    ListOrdersArgs,
    OrderConflict,
    OrderFilterArgs,
    OrdersPage,
    OrdersSummary,
    OutgoingOrderInterface,
    UpdateOrderBody,
} from '../app/types';
import type { AppDispatch, AppThunk, RootState } from '../app/store';
import { matchesListArgs, sortsBefore } from '../features/orders/orderFilters';
import {
    markOrderCreated,
    markOrderRemoved,
    markOrderUpdated,
    orderWritePending,
    orderWriteSettled,
    orderWriteSuperseded,
    summaryLoaded,
} from '../features/slices/outgoingOrdersSlice';
import { openSnackbar, type RetryDescriptor } from '../features/slices/snackbarSlice';

const SUMMARY_REFRESH_DELAY_MS = 1000;

interface AxiosQueryArgs {
    url: string;
    method?: Method;
    params?: AxiosRequestConfig['params'];
    data?: unknown;
}

interface AxiosQueryError {
    status?: number;
    message: string;
    data?: unknown;
}

const axiosBaseQuery: BaseQueryFn<AxiosQueryArgs, unknown, AxiosQueryError> = async (
    { url, method = 'get', params, data },
    { signal },
) => {
    try {
        const response = await api({ url, method, params, data, signal });
        return { data: response.data };
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return {
            error: {
                status: axiosError.response?.status,
                message: axiosError.response?.data?.message ?? axiosError.message,
                data: axiosError.response?.data,
            },
        };
    }
};

interface WriteFailure {
    // the version that won
    conflict?: OutgoingOrderInterface;
    message?: string;
    isWorthRetrying: boolean;
}

export const readFailure = (error: AxiosQueryError | SerializedError | undefined): WriteFailure => {
    const queryError = error && 'status' in error ? error : undefined;
    const refusal = queryError?.status !== undefined && queryError.status < 500 ? queryError : undefined;
    if (!refusal) {
        return { isWorthRetrying: true };
    }

    return {
        conflict: refusal.status === 409 ? (refusal.data as OrderConflict).current : undefined,
        message: refusal.message,
        isWorthRetrying: false,
    };
};

const insertIntoLoadedPages = (pages: OrdersPage[], order: OutgoingOrderInterface) => {
    for (const page of pages) {
        const insertIndex = page.data.findIndex((loadedOrder) => sortsBefore(order, loadedOrder));
        if (insertIndex !== -1) {
            page.data.splice(insertIndex, 0, order);
            return;
        }
    }

    const lastPage = pages[pages.length - 1];
    const allPagesLoaded = lastPage !== undefined && lastPage.nextCursor === null;
    if (allPagesLoaded) {
        lastPage.data.push(order);
    }
};

export const findHeldOrder = (state: RootState, orderId: number): OutgoingOrderInterface | undefined => {
    const cachedOrder = ordersApi.endpoints.getOrder.select(orderId)(state).data;
    if (cachedOrder) {
        return cachedOrder;
    }

    for (const listArgs of ordersApi.util.selectCachedArgsForQuery(state, 'listOrders')) {
        const cachedPages = ordersApi.endpoints.listOrders.select(listArgs)(state).data?.pages ?? [];
        for (const page of cachedPages) {
            const found = page.data.find((order) => order.id === orderId);
            if (found) {
                return found;
            }
        }
    }

    return undefined;
};

const upsertOrderInCaches =
    (order: OutgoingOrderInterface): AppThunk =>
    (dispatch, getState) => {
        dispatch(ordersApi.util.updateQueryData('getOrder', order.id, () => order));

        for (const listArgs of ordersApi.util.selectCachedArgsForQuery(getState(), 'listOrders')) {
            dispatch(
                ordersApi.util.updateQueryData('listOrders', listArgs, (draft) => {
                    for (const page of draft.pages) {
                        page.data = page.data.filter((loadedOrder) => loadedOrder.id !== order.id);
                    }
                    if (matchesListArgs(order, listArgs)) {
                        insertIntoLoadedPages(draft.pages, order);
                    }
                }),
            );
        }
    };

const removeOrderFromCaches =
    (orderId: number): AppThunk =>
    (dispatch, getState) => {
        for (const listArgs of ordersApi.util.selectCachedArgsForQuery(getState(), 'listOrders')) {
            dispatch(
                ordersApi.util.updateQueryData('listOrders', listArgs, (draft) => {
                    for (const page of draft.pages) {
                        page.data = page.data.filter((loadedOrder) => loadedOrder.id !== orderId);
                    }
                }),
            );
        }
    };

export const applyServerOrder =
    (order: OutgoingOrderInterface): AppThunk<boolean> =>
    (dispatch, getState) => {
        const heldOrder = findHeldOrder(getState(), order.id);
        if (heldOrder && order.version <= heldOrder.version) {
            return false;
        }

        dispatch(upsertOrderInCaches(order));
        dispatch(orderWriteSuperseded(order.id));
        return true;
    };

export const applyServerDeletion =
    (orderId: number): AppThunk =>
    (dispatch) => {
        dispatch(removeOrderFromCaches(orderId));
        dispatch(ordersApi.util.invalidateTags([{ type: 'Order', id: orderId }]));
        dispatch(orderWriteSuperseded(orderId));
    };

let pendingSummaryRefresh: number | undefined;

export const scheduleSummaryRefresh = (dispatch: AppDispatch) => {
    if (pendingSummaryRefresh !== undefined) {
        return;
    }
    pendingSummaryRefresh = window.setTimeout(() => {
        pendingSummaryRefresh = undefined;
        dispatch(ordersApi.util.invalidateTags(['Summary']));
    }, SUMMARY_REFRESH_DELAY_MS);
};

export const cancelSummaryRefresh = () => {
    if (pendingSummaryRefresh !== undefined) {
        window.clearTimeout(pendingSummaryRefresh);
        pendingSummaryRefresh = undefined;
    }
};

interface WriteLifecycle<Result> {
    dispatch: AppDispatch;
    getState: () => unknown;
    queryFulfilled: Promise<{ data: Result }>;
}

interface WriteContext {
    snapshot?: OutgoingOrderInterface;
    isSuperseded: boolean;
}

interface OptimisticWrite<Result> {
    orderId: number;
    applyOptimistic: (snapshot: OutgoingOrderInterface) => void;
    onSuccess: (result: Result, context: WriteContext) => void;
    onFailure: (error: AxiosQueryError | undefined, context: WriteContext) => void;
}

const runOptimisticWrite = async <Result>(
    { dispatch, getState, queryFulfilled }: WriteLifecycle<Result>,
    { orderId, applyOptimistic, onSuccess, onFailure }: OptimisticWrite<Result>,
): Promise<void> => {
    const readState = () => getState() as RootState;
    const snapshot = findHeldOrder(readState(), orderId);
    const readContext = (): WriteContext => ({
        snapshot,
        isSuperseded: readState().outgoingOrders.pendingWrites[orderId]?.isSuperseded ?? false,
    });

    dispatch(orderWritePending(orderId));
    if (snapshot) {
        applyOptimistic(snapshot);
    }

    try {
        await queryFulfilled.then(
            ({ data }) => onSuccess(data, readContext()),
            (rejection) => {
                const error = (rejection as { error?: AxiosQueryError }).error;
                const context = readContext();

                if (error?.status === 404) {
                    dispatch(applyServerDeletion(orderId));
                } else if (snapshot && !context.isSuperseded) {
                    dispatch(upsertOrderInCaches(snapshot));
                }
                onFailure(error, context);
            },
        );
    } finally {
        dispatch(orderWriteSettled(orderId));
    }
};

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: axiosBaseQuery,
    tagTypes: ['Summary', 'Order'],
    endpoints: (build) => ({
        listOrders: build.infiniteQuery<OrdersPage, ListOrdersArgs, string | null>({
            infiniteQueryOptions: {
                initialPageParam: null,
                getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
            },
            query: ({ queryArg, pageParam }) => ({
                url: '/orders',
                params: { ...queryArg, limit: PAGE_SIZE, ...(pageParam && { cursor: pageParam }) },
            }),
        }),
        getOrdersSummary: build.query<OrdersSummary, OrderFilterArgs>({
            query: (filterArgs) => ({ url: '/orders/summary', params: filterArgs }),
            providesTags: ['Summary'],
            onQueryStarted: async (_filterArgs, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    dispatch(summaryLoaded());
                } catch {
                    // the clock waits for a load that succeeds
                }
            },
        }),
        getOrder: build.query<OutgoingOrderInterface, number>({
            query: (orderId) => ({ url: `/orders/${orderId}` }),
            providesTags: (_result, _error, orderId) => [{ type: 'Order', id: orderId }],
        }),
        createOrder: build.mutation<OutgoingOrderInterface, CreateOrderBody>({
            query: (body) => ({ url: '/orders', method: 'post', data: body }),
            onQueryStarted: async (_body, { dispatch, queryFulfilled }) => {
                try {
                    const { data: created } = await queryFulfilled;
                    dispatch(applyServerOrder(created));
                    dispatch(markOrderCreated(created.id));
                    scheduleSummaryRefresh(dispatch);
                    dispatch(openSnackbar('Order successfully created!'));
                } catch {
                    dispatch(openSnackbar('Failed to create order.'));
                }
            },
        }),
        updateOrder: build.mutation<OutgoingOrderInterface, UpdateOrderBody>({
            query: (body) => ({ url: `/orders/${body.id}`, method: 'put', data: body }),
            onQueryStarted: async (body, lifecycle) => {
                const { dispatch } = lifecycle;
                await runOptimisticWrite(lifecycle, {
                    orderId: body.id,
                    applyOptimistic: (snapshot) =>
                        dispatch(
                            upsertOrderInCaches({
                                ...snapshot,
                                customer: body.customer,
                                status: body.status,
                                priority: body.priority,
                                items: body.items,
                            }),
                        ),
                    onSuccess: (saved, { snapshot }) => {
                        dispatch(applyServerOrder(saved));
                        dispatch(markOrderUpdated({ order: saved, previousStatus: snapshot?.status }));
                        scheduleSummaryRefresh(dispatch);
                        dispatch(openSnackbar('Order successfully updated!'));
                    },
                    onFailure: (error) => {
                        const { conflict, message } = readFailure(error);
                        if (conflict) {
                            dispatch(applyServerOrder(conflict));
                        } else {
                            dispatch(openSnackbar(message ?? 'Failed to update order.'));
                        }
                    },
                });
            },
        }),
        advanceOrderStatus: build.mutation<OutgoingOrderInterface, number>({
            query: (orderId) => ({ url: `/orders/${orderId}/status`, method: 'patch' }),
            onQueryStarted: async (orderId, lifecycle) => {
                const { dispatch } = lifecycle;
                await runOptimisticWrite(lifecycle, {
                    orderId,
                    applyOptimistic: (snapshot) => {
                        const nextStatus = STATUS_TRANSITIONS[snapshot.status];
                        if (nextStatus) {
                            dispatch(upsertOrderInCaches({ ...snapshot, status: nextStatus }));
                        }
                    },
                    onSuccess: (advanced, { snapshot }) => {
                        dispatch(applyServerOrder(advanced));
                        dispatch(markOrderUpdated({ order: advanced, previousStatus: snapshot?.status }));
                        scheduleSummaryRefresh(dispatch);
                        dispatch(openSnackbar('Order status successfully updated!'));
                    },
                    onFailure: (error, { snapshot, isSuperseded }) => {
                        const { conflict, message, isWorthRetrying } = readFailure(error);
                        if (conflict) {
                            dispatch(applyServerOrder(conflict));
                            dispatch(openSnackbar('This order has already moved on.'));
                            return;
                        }

                        dispatch(
                            openSnackbar({
                                message: message ?? 'Failed to update order status.',
                                retry:
                                    isWorthRetrying && snapshot && !isSuperseded
                                        ? { kind: 'advance', orderId, fromStatus: snapshot.status }
                                        : undefined,
                            }),
                        );
                    },
                });
            },
        }),
        deleteOrder: build.mutation<{ message: string }, number>({
            query: (orderId) => ({ url: `/orders/${orderId}`, method: 'delete' }),
            onQueryStarted: async (orderId, lifecycle) => {
                const { dispatch } = lifecycle;
                await runOptimisticWrite(lifecycle, {
                    orderId,
                    applyOptimistic: () => dispatch(removeOrderFromCaches(orderId)),
                    onSuccess: () => {
                        dispatch(applyServerDeletion(orderId));
                        dispatch(markOrderRemoved(orderId));
                        scheduleSummaryRefresh(dispatch);
                        dispatch(openSnackbar('Order successfully deleted!'));
                    },
                    onFailure: (error, { isSuperseded }) => {
                        if (error?.status === 404) {
                            dispatch(openSnackbar('This order was already deleted.'));
                            return;
                        }

                        const { message, isWorthRetrying } = readFailure(error);
                        dispatch(
                            openSnackbar({
                                message: message ?? 'Failed to delete order.',
                                retry: isWorthRetrying && !isSuperseded ? { kind: 'delete', orderId } : undefined,
                            }),
                        );
                    },
                });
            },
        }),
    }),
});

export const retryWrite =
    (retry: RetryDescriptor): AppThunk =>
    (dispatch, getState) => {
        if (retry.kind === 'delete') {
            dispatch(ordersApi.endpoints.deleteOrder.initiate(retry.orderId, { track: false }));
            return;
        }

        if (findHeldOrder(getState(), retry.orderId)?.status !== retry.fromStatus) {
            dispatch(openSnackbar('This order has already moved on.'));
            return;
        }
        dispatch(ordersApi.endpoints.advanceOrderStatus.initiate(retry.orderId, { track: false }));
    };

export const {
    useListOrdersInfiniteQuery,
    useGetOrdersSummaryQuery,
    useGetOrderQuery,
    useLazyGetOrderQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useAdvanceOrderStatusMutation,
    useDeleteOrderMutation,
} = ordersApi;
