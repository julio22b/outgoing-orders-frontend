import type { DataGridHeadersInterface } from "./types/types";


export const ORDER_STATUSES = {
    PICKING: 'picking',
    PACKED: 'packed',
    DELAYED: 'delayed',
    DISPATCHED: 'dispatched',
} as const;

export const DATA_GRID_HEADERS: DataGridHeadersInterface[] = [
    { title: 'Order ID', id: ' order-id' },
    { title: 'Customer', id: 'customer' },
    { title: 'Status', id: 'status' },
    { title: 'Priority', id: 'priority' },
    { title: 'Created', id: 'created' },
];

export const ORDER_FIELDS = {
    ID: 'id',
    CUSTOMER: 'customer',
    STATUS: 'status',
    PRIORITY: 'priority',
    CREATED_AT: 'createdAt',
} as const;

export const ORDER_PRIORITIES = {
    HIGH: 'high',
    NORMAL: 'normal',
    LOW: 'low',
} as const;