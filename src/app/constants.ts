import type { OrderStatus } from './types';

export const ORDER_STATUSES = {
    PICKING: 'picking',
    PACKED: 'packed',
    DELAYED: 'delayed',
    DISPATCHED: 'dispatched',
} as const;

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

export const TIMELINE_STATUSES = [ORDER_STATUSES.PICKING, ORDER_STATUSES.PACKED, ORDER_STATUSES.DISPATCHED];

export const STATUSES_ENUM: Record<string, number> = {
    picking: 1,
    packed: 2,
    dispatched: 3,
    delayed: 4,
};

export const STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
    picking: 'packed',
    packed: 'dispatched',
};

export const PAGE_SIZE = 5;

export const ALL_FILTER = 'all';

export const HIDDEN_ORDER_STATUSES: readonly OrderStatus[] = [ORDER_STATUSES.DELAYED];

export const VISIBLE_ORDER_STATUSES = Object.values(ORDER_STATUSES).filter(
    (status) => !HIDDEN_ORDER_STATUSES.includes(status),
);
