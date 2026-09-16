import { ordersApi } from '../../api/ordersApi';
import type { AppDispatch, AppThunk, RootState } from '../../app/store';
import type { OrdersPage, OutgoingOrderInterface } from '../../app/types';
import { markOrderCreated, markOrderRemoved, markOrderUpdated } from '../slices/outgoingOrdersSlice';
import { matchesListArgs, sortsBefore } from './orderFilters';

const SUMMARY_REFRESH_DELAY_MS = 1000;

type OrderEvent =
    | { type: 'created'; order: OutgoingOrderInterface }
    | { type: 'updated'; order: OutgoingOrderInterface }
    | { type: 'deleted'; orderId: number };

let pendingSummaryRefresh: number | undefined;

const scheduleSummaryRefresh = (dispatch: AppDispatch) => {
    if (pendingSummaryRefresh !== undefined) {
        return;
    }
    pendingSummaryRefresh = window.setTimeout(() => {
        pendingSummaryRefresh = undefined;
        dispatch(ordersApi.util.invalidateTags(['Summary']));
    }, SUMMARY_REFRESH_DELAY_MS);
};

const findCachedStatus = (state: RootState, orderId: number) => {
    for (const listArgs of ordersApi.util.selectCachedArgsForQuery(state, 'listOrders')) {
        const cachedPages = ordersApi.endpoints.listOrders.select(listArgs)(state).data?.pages ?? [];
        if (cachedPages.some((page) => page.data.some((order) => order.id === orderId))) {
            return listArgs.status;
        }
    }
    return undefined;
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

const patchCachedColumns = (dispatch: AppDispatch, state: RootState, event: OrderEvent) => {
    const eventOrderId = event.type === 'deleted' ? event.orderId : event.order.id;

    for (const listArgs of ordersApi.util.selectCachedArgsForQuery(state, 'listOrders')) {
        dispatch(
            ordersApi.util.updateQueryData('listOrders', listArgs, (draft) => {
                for (const page of draft.pages) {
                    page.data = page.data.filter((order) => order.id !== eventOrderId);
                }
                if (event.type !== 'deleted' && matchesListArgs(event.order, listArgs)) {
                    insertIntoLoadedPages(draft.pages, event.order);
                }
            }),
        );
    }
};

export const applyOrderEvent =
    (event: OrderEvent): AppThunk =>
    (dispatch, getState) => {
        const stateBeforeEvent = getState();

        if (event.type === 'created') {
            dispatch(markOrderCreated(event.order.id));
        } else if (event.type === 'updated') {
            const previousStatus = findCachedStatus(stateBeforeEvent, event.order.id);
            dispatch(markOrderUpdated({ order: event.order, previousStatus }));
        } else {
            dispatch(markOrderRemoved(event.orderId));
        }

        patchCachedColumns(dispatch, stateBeforeEvent, event);
        scheduleSummaryRefresh(dispatch);
    };
