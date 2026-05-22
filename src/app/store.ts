import { configureStore } from '@reduxjs/toolkit';
import outgoingOrdersReducer from '../features/slices/outgoingOrdersSlice';
import filtersReducer from '../features/slices/filtersSlice';

export const store = configureStore({
    reducer: {
        outgoingOrders: outgoingOrdersReducer,
        filters: filtersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
