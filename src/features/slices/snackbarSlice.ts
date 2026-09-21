import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderStatus } from '../../app/types';

export type RetryDescriptor =
    | { kind: 'advance'; orderId: number; fromStatus: OrderStatus }
    | { kind: 'delete'; orderId: number };

type SnackbarPayload = string | { message: string; retry?: RetryDescriptor };

interface SnackbarInitialState {
    open: boolean;
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    message: string;
    retry: RetryDescriptor | null;
}

const initialState: SnackbarInitialState = {
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    message: '',
    retry: null,
};

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar: (state, action: PayloadAction<SnackbarPayload>) => {
            const payload = typeof action.payload === 'string' ? { message: action.payload } : action.payload;
            state.open = true;
            state.message = payload.message;
            state.retry = payload.retry ?? null;
        },
        closeSnackbar: (state) => {
            state.open = false;
            state.retry = null;
        },
    },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
