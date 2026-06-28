import { createSlice } from '@reduxjs/toolkit';

interface FiltersInitialState {
    status: string;
    priority: string;
    search: string;
    date: string | null;
}
const initialState: FiltersInitialState = {
    status: 'all',
    priority: 'all',
    search: '',
    date: null,
};

export const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        statusFilterChanged: (state, action) => {
            state.status = action.payload;
        },
        priorityFilterChanged: (state, action) => {
            state.priority = action.payload;
        },
        searchFilterChanged: (state, action) => {
            state.search = action.payload;
        },
        dateFilterChanged: (state, action) => {
            state.date = action.payload;
        },
    },
});

export const { statusFilterChanged, priorityFilterChanged, searchFilterChanged, dateFilterChanged } = filtersSlice.actions;

export default filtersSlice.reducer;
