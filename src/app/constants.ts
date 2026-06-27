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

export const STATUS_COLORS: Record<string, { background: string; color: string; accent: string }> = {
    [ORDER_STATUSES.PICKING]: { background: '#fde3c4', color: '#804813', accent: '#d79e59' },
    [ORDER_STATUSES.PACKED]: { background: '#cbefdb', color: '#1d533c', accent: '#6aa085' },
    [ORDER_STATUSES.DISPATCHED]: { background: '#cde9fd', color: '#22587a', accent: '#5787a5' },
    [ORDER_STATUSES.DELAYED]: { background: '#ffe2db', color: '#a04130', accent: '#c15f4d' },
    [ORDER_PRIORITIES.HIGH]: { background: '#ffded5', color: '#a04130', accent: '#c15f4d' },
    [ORDER_PRIORITIES.NORMAL]: { background: '#ebe7e2', color: '#625d56', accent: '#a89f97' },
    [ORDER_PRIORITIES.LOW]: { background: '#d2edfc', color: '#286484', accent: '#5787a5' },
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
