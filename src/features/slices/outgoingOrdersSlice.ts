import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import type { OutgoingOrderInterface } from '../../app/types';
import api from '../../api/axiosInstance';

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
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order: OutgoingOrderInterface, thunkAPI) => {
    try {
        const data = (await api.put(`${ordersPath}/${order.id}`, order)).data;
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id: number, thunkAPI) => {
    try {
        await api.delete(`${ordersPath}/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const outgoingOrdersSlice = createSlice({
    name: 'outgoingOrders',
    initialState,
    reducers: {},
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
            // create order
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<OutgoingOrderInterface>) => {
                state.loading = false;
                state.orders.unshift(action.payload);
            })
            // update order
            .addCase(updateOrder.fulfilled, (state, action: PayloadAction<OutgoingOrderInterface>) => {
                state.loading = false;
                state.orders = state.orders.map((order) => {
                    if (order.id === action.payload.id) {
                        return action.payload;
                    }
                    return order;
                });
            })
            // delete order
            .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.orders = state.orders.filter((order) => order.id !== action.payload);
            })
            // matchers
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
                },
            );
    },
});

export default outgoingOrdersSlice.reducer;
