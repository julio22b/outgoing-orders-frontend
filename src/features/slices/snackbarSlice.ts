import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SnackbarInitialState {
    open: boolean;
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    message: string;
}

const initialState: SnackbarInitialState = {
    open: false,
    vertical: 'top',
    horizontal: 'right',
    message: '',
};

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar: (state, action: PayloadAction<string>) => {
            state.open = true;
            state.message = action.payload;
        },
        closeSnackbar: (state) => {
            state.open = false;
        },
    },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
