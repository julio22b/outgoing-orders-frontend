import { configureStore } from '@reduxjs/toolkit'
import outgoingOrdersReducer from '../features/outgoing_orders/outgoingOrdersSlice'

export const store = configureStore({
  reducer: {
    outgoingOrders: outgoingOrdersReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch