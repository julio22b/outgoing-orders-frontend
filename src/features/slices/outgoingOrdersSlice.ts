import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderStatus, OutgoingOrderInterface } from '../../app/types';
import api from '../../api/axiosInstance';
import { ordersApi } from '../../api/ordersApi';

import { openSnackbar } from './snackbarSlice';
const MARK_TTL_MS = 6000;

interface RecentChange {
    at: number;
    statusChanged: boolean;
}

interface OutgoingOrdersInitialState {
    saving: boolean;
    error: unknown;
    detailsLoading: boolean;
    detailsOrder?: OutgoingOrderInterface;
    lastEventAt: number | null;
    recentChanges: Record<number, RecentChange>;
}

const initialState: OutgoingOrdersInitialState = {
    saving: false,
    error: null,
    detailsLoading: false,
    detailsOrder: undefined,
    lastEventAt: null,
    recentChanges: {},
};

const clearChanges = (changes: Record<number, RecentChange>, now: number) => {
    for (const key of Object.keys(changes)) {
        const id = Number(key);
        if (now - changes[id].at > MARK_TTL_MS) delete changes[id];
    }
};

const recordChange = (state: OutgoingOrdersInitialState, orderId: number, statusChanged: boolean) => {
    const now = Date.now();
    state.lastEventAt = now;
    clearChanges(state.recentChanges, now);
    state.recentChanges[orderId] = { at: now, statusChanged };
};

const ordersPath = '/orders';

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async (id: string, thunkAPI) => {
    try {
        const data = (await api.get(`${ordersPath}/${id}`)).data;
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const createOrder = createAsyncThunk('orders/createOrder', async (order: OutgoingOrderInterface, thunkAPI) => {
    try {
        const data = (await api.post(ordersPath, order)).data;
        thunkAPI.dispatch(openSnackbar('Order successfully created!'));
        return data;
    } catch (error) {
        thunkAPI.dispatch(openSnackbar('Failed to create order.'));
        return thunkAPI.rejectWithValue(error);
    }
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order: OutgoingOrderInterface, thunkAPI) => {
    try {
        const data = (await api.put(`${ordersPath}/${order.id}`, order)).data;
        thunkAPI.dispatch(openSnackbar('Order successfully updated!'));
        return data;
    } catch (error) {
        thunkAPI.dispatch(openSnackbar('Failed to update order.'));
        return thunkAPI.rejectWithValue(error);
    }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id: number, thunkAPI) => {
    try {
        await api.delete(`${ordersPath}/${id}`);
        thunkAPI.dispatch(openSnackbar('Order successfully deleted!'));
        return id;
    } catch (error) {
        thunkAPI.dispatch(openSnackbar('Failed to delete order.'));
        return thunkAPI.rejectWithValue(error);
    }
});

export const updateOrderStatus = createAsyncThunk('orders/updateOrderStatus', async (id: number, thunkAPI) => {
    try {
        await api.patch(`${ordersPath}/${id}/status`);
        thunkAPI.dispatch(openSnackbar('Order status successfully updated!'));
        return id;
    } catch (error) {
        thunkAPI.dispatch(openSnackbar('Failed to update order status.'));
        return thunkAPI.rejectWithValue(error);
    }
});

export const outgoingOrdersSlice = createSlice({
    name: 'outgoingOrders',
    initialState,
    reducers: {
        markOrderCreated: (state, action: PayloadAction<number>) => {
            recordChange(state, action.payload, false);
        },
        markOrderUpdated: (
            state,
            action: PayloadAction<{ order: OutgoingOrderInterface; previousStatus?: OrderStatus }>,
        ) => {
            const { order, previousStatus } = action.payload;
            const isDetailsOrder = state.detailsOrder?.id === order.id;
            const knownPreviousStatus = previousStatus ?? (isDetailsOrder ? state.detailsOrder?.status : undefined);

            if (isDetailsOrder) {
                state.detailsOrder = order;
            }
            recordChange(state, order.id, knownPreviousStatus !== undefined && knownPreviousStatus !== order.status);
        },
        markOrderRemoved: (state, action: PayloadAction<number>) => {
            const now = Date.now();
            state.lastEventAt = now;
            clearChanges(state.recentChanges, now);
            delete state.recentChanges[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch order
            .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<OutgoingOrderInterface>) => {
                state.detailsLoading = false;
                state.detailsOrder = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action: PayloadAction<unknown>) => {
                state.detailsLoading = false;
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.fulfilled, (state) => {
                state.detailsLoading = false;
                state.error = null;
            })
            .addCase(updateOrderStatus.rejected, (state, action: PayloadAction<unknown>) => {
                state.detailsLoading = false;
                state.error = action.payload;
            })
            // matchers
            .addMatcher(isAnyOf(fetchOrder.pending, updateOrderStatus.pending), (state) => {
                state.detailsLoading = true;
                state.error = null;
            })
            .addMatcher(isAnyOf(createOrder.pending, updateOrder.pending, deleteOrder.pending), (state) => {
                state.saving = true;
                state.error = null;
            })
            .addMatcher(isAnyOf(createOrder.fulfilled, updateOrder.fulfilled, deleteOrder.fulfilled), (state) => {
                state.saving = false;
            })
            .addMatcher(
                isAnyOf(createOrder.rejected, updateOrder.rejected, deleteOrder.rejected),
                (state, action: PayloadAction<unknown>) => {
                    state.saving = false;
                    state.error = action.payload;
                },
            )

            .addMatcher(ordersApi.endpoints.getOrdersSummary.matchFulfilled, (state) => {
                state.lastEventAt ??= Date.now();
            });
    },
});

export const { markOrderCreated, markOrderUpdated, markOrderRemoved } = outgoingOrdersSlice.actions;

export default outgoingOrdersSlice.reducer;
