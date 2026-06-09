import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { OutgoingOrderInterface } from '../../app/types';
import api from '../../api/axiosInstance';

import { openSnackbar } from './snackbarSlice';
interface OutgoingOrdersInitialState {
    orders: OutgoingOrderInterface[];
    loading: boolean;
    error: unknown;
    detailsLoading: boolean;
    detailsOrder?: OutgoingOrderInterface;
}

const initialState: OutgoingOrdersInitialState = {
    orders: [],
    loading: true,
    error: null,
    detailsLoading: false,
    detailsOrder: undefined,
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

export const statusTransitionOrder = createAsyncThunk('orders/statusTransitionOrder', async (id: number, thunkAPI) => {
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
            state.orders.unshift(action.payload);
        },
        updateOrderInStore: (state, action: PayloadAction<OutgoingOrderInterface>) => {
            state.orders = state.orders.map((order) => (order.id === action.payload.id ? action.payload : order));
            state.detailsOrder = action.payload;
        },
        removeOrder: (state, action: PayloadAction<number>) => {
            state.orders = state.orders.filter((order) => order.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch orders
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OutgoingOrderInterface[]>) => {
                state.loading = false;
                state.orders = action.payload;
            })
            // fetch order
            .addCase(fetchOrder.pending, (state) => {
                state.detailsLoading = true;
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<OutgoingOrderInterface>) => {
                state.detailsLoading = false;
                state.detailsOrder = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action: PayloadAction<unknown>) => {
                state.detailsLoading = false;
                state.error = action.payload;
            })
            // matchers
            .addMatcher(
                isAnyOf(
                    createOrder.fulfilled,
                    updateOrder.fulfilled,
                    deleteOrder.fulfilled,
                    statusTransitionOrder.fulfilled,
                ),
                (state) => {
                    state.loading = false;
                },
            )
            .addMatcher(
                isAnyOf(
                    fetchOrders.pending,
                    createOrder.pending,
                    updateOrder.pending,
                    deleteOrder.pending,
                    statusTransitionOrder.pending,
                ),
                (state) => {
                    state.loading = true;
                    state.error = null;
                },
            )
            .addMatcher(
                isAnyOf(
                    fetchOrders.rejected,
                    createOrder.rejected,
                    updateOrder.rejected,
                    deleteOrder.rejected,
                    statusTransitionOrder.rejected,
                ),
                (state, action: PayloadAction<unknown>) => {
                    state.loading = false;
                    state.error = action.payload;
                },
            );
    },
});

export const { addOrder, updateOrderInStore, removeOrder } = outgoingOrdersSlice.actions;

export default outgoingOrdersSlice.reducer;
