import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import api from './axiosInstance';
import { PAGE_SIZE } from '../app/constants';
import type { ListOrdersArgs, OrderFilterArgs, OrdersPage, OrdersSummary } from '../app/types';

interface AxiosQueryArgs {
    url: string;
    params?: AxiosRequestConfig['params'];
}

interface AxiosQueryError {
    status?: number;
    message: string;
}

const axiosBaseQuery: BaseQueryFn<AxiosQueryArgs, unknown, AxiosQueryError> = async ({ url, params }, { signal }) => {
    try {
        const response = await api.get(url, { params, signal });
        return { data: response.data };
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return {
            error: {
                status: axiosError.response?.status,
                message: axiosError.response?.data?.message ?? axiosError.message,
            },
        };
    }
};

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: axiosBaseQuery,
    tagTypes: ['Summary'],
    endpoints: (build) => ({
        listOrders: build.infiniteQuery<OrdersPage, ListOrdersArgs, string | null>({
            infiniteQueryOptions: {
                initialPageParam: null,
                getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
            },
            query: ({ queryArg, pageParam }) => ({
                url: '/orders',
                params: { ...queryArg, limit: PAGE_SIZE, ...(pageParam && { cursor: pageParam }) },
            }),
        }),
        getOrdersSummary: build.query<OrdersSummary, OrderFilterArgs>({
            query: (filterArgs) => ({ url: '/orders/summary', params: filterArgs }),
            providesTags: ['Summary'],
        }),
    }),
});

export const { useListOrdersInfiniteQuery, useGetOrdersSummaryQuery } = ordersApi;
