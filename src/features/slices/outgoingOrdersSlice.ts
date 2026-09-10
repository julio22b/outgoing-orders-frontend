import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { OutgoingOrderInterface } from '../../app/types';
import api from '../../api/axiosInstance';

import { openSnackbar } from './snackbarSlice';
/** How long a socket-driven change stays marked on the board. */
const MARK_TTL_MS = 6000;

interface RecentChange {
    at: number;
    statusChanged: boolean;
}

interface OutgoingOrdersInitialState {
    orders: OutgoingOrderInterface[];
    loading: boolean;
    error: unknown;
    detailsLoading: boolean;
    detailsOrder?: OutgoingOrderInterface;
    initialized: boolean;
    /** Timestamp of the last socket message, shown in the letterhead. */
    lastEventAt: number | null;
    /** Orders touched by another client, so their rows can mark themselves. */
    recentChanges: Record<number, RecentChange>;
}

const initialState: OutgoingOrdersInitialState = {
    orders: [],
    loading: true,
    error: null,
    detailsLoading: false,
    detailsOrder: undefined,
    initialized: false,
    lastEventAt: null,
    recentChanges: {},
};

/** Keeps `recentChanges` from growing for the lifetime of the session. */
const pruneChanges = (changes: Record<number, RecentChange>, now: number) => {
    for (const key of Object.keys(changes)) {
        const id = Number(key);
        if (now - changes[id].at > MARK_TTL_MS) delete changes[id];
    }
};

const ordersPath = '/orders';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, thunkAPI) => {
    try {
        const data = (await api.get(ordersPath)).data;
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

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
        addOrder: (state, action: PayloadAction<OutgoingOrderInterface>) => {
            const now = Date.now();
            state.orders.unshift(action.payload);
            state.lastEventAt = now;
            pruneChanges(state.recentChanges, now);
            state.recentChanges[action.payload.id] = { at: now, statusChanged: false };
        },
        updateOrderInStore: (state, action: PayloadAction<OutgoingOrderInterface>) => {
            const now = Date.now();
            const previous = state.orders.find((order) => order.id === action.payload.id);
            // A status change is the one worth stamping; an edited customer name is not.
            const statusChanged = !!previous && previous.status !== action.payload.status;

            state.orders = state.orders.map((order) => (order.id === action.payload.id ? action.payload : order));
            state.detailsOrder = action.payload;
            state.lastEventAt = now;
            pruneChanges(state.recentChanges, now);
            state.recentChanges[action.payload.id] = { at: now, statusChanged };
        },
        removeOrder: (state, action: PayloadAction<number>) => {
            const now = Date.now();
            state.orders = state.orders.filter((order) => order.id !== action.payload);
            state.lastEventAt = now;
            pruneChanges(state.recentChanges, now);
            delete state.recentChanges[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch orders
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OutgoingOrderInterface[]>) => {
                state.loading = false;
                state.orders = action.payload;
                state.initialized = true;
                // Seeded here so the letterhead always shows a real time rather
                // than waiting for the first socket message to arrive.
                state.lastEventAt = Date.now();
            })
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
            .addMatcher(isAnyOf(createOrder.fulfilled, updateOrder.fulfilled, deleteOrder.fulfilled), (state) => {
                state.loading = false;
            })
            .addMatcher(
                isAnyOf(fetchOrders.pending, createOrder.pending, updateOrder.pending, deleteOrder.pending),
                (state) => {
                    state.loading = true;
                    state.error = null;
                },
            )
            .addMatcher(
                isAnyOf(fetchOrders.rejected, createOrder.rejected, updateOrder.rejected, deleteOrder.rejected),
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload;
                    state.initialized = true;
                },
            );
    },
});

export const { addOrder, updateOrderInStore, removeOrder } = outgoingOrdersSlice.actions;

export default outgoingOrdersSlice.reducer;
