import type { DataGridHeadersInterface } from './types';

export const ORDER_STATUSES = {
    PICKING: 'picking',
    PACKED: 'packed',
    DELAYED: 'delayed',
    DISPATCHED: 'dispatched',
} as const;

export const OUTGOING_ORDERS_DATAGRID_COLUMNS: DataGridHeadersInterface[] = [
    { title: 'Order ID', id: 'order-id' },
    { title: 'Customer', id: 'customer' },
    { title: 'Status', id: 'status' },
    { title: 'Priority', id: 'priority' },
    { title: 'Created', id: 'created' },
    { title: '', id: 'actions' },
];

export const ORDER_FIELDS = {
    ID: 'id',
    CUSTOMER: 'customer',
    STATUS: 'status',
    PRIORITY: 'priority',
    CREATED_AT: 'createdAt',
    ITEMS: 'items',
    STATUS_HISTORY: 'statusHistory',
} as const;

export const ORDER_PRIORITIES = {
    HIGH: 'high',
    NORMAL: 'normal',
    LOW: 'low',
} as const;

export const STATUS_COLORS: Record<string, { background: string; color: string }> = {
    [ORDER_STATUSES.PICKING]: { background: '#f8e3bf', color: '#774406' },
    [ORDER_STATUSES.PACKED]: { background: '#cbf6e7', color: '#0b6a52' },
    [ORDER_STATUSES.DISPATCHED]: { background: '#dff6c2', color: '#31600b' },
    [ORDER_STATUSES.DELAYED]: { background: '#f8cccc', color: '#911c1c' },
    [ORDER_PRIORITIES.HIGH]: { background: '#f8cccc', color: '#911c1c' },
    [ORDER_PRIORITIES.NORMAL]: { background: '#dcd5d5', color: '#5c5c5c' },
    [ORDER_PRIORITIES.LOW]: { background: '#f8e3bf', color: '#774406' },
};

export const TIMELINE_STATUSES = [ORDER_STATUSES.PICKING, ORDER_STATUSES.PACKED, ORDER_STATUSES.DISPATCHED];

export const STATUSES_ENUM: Record<string, number> = {
    picking: 1,
    packed: 2,
    dispatched: 3,
    delayed: 4,
};

export const STATUS_TRANSITIONS: Record<string, string> = {
    picking: 'packed',
    packed: 'dispatched',
};
