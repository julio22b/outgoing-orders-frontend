import { configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';
import outgoingOrdersReducer from '../features/slices/outgoingOrdersSlice';
import filtersReducer from '../features/slices/filtersSlice';
import snackbarReducer from '../features/slices/snackbarSlice';
import { ordersApi } from '../api/ordersApi';

export const store = configureStore({
    reducer: {
        outgoingOrders: outgoingOrdersReducer,
        filters: filtersReducer,
        snackbar: snackbarReducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, undefined, UnknownAction>;
