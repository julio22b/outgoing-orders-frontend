import { configureStore } from '@reduxjs/toolkit';
import outgoingOrdersReducer from '../features/slices/outgoingOrdersSlice';
import filtersReducer from '../features/slices/filtersSlice';
import snackbarReducer from '../features/slices/snackbarSlice';

export const store = configureStore({
    reducer: {
        outgoingOrders: outgoingOrdersReducer,
        filters: filtersReducer,
        snackbar: snackbarReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
