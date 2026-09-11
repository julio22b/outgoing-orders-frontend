import type { ORDER_PRIORITIES, ORDER_STATUSES } from './constants';

type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];
type OrderPriority = (typeof ORDER_PRIORITIES)[keyof typeof ORDER_PRIORITIES];

interface OutgoingOrderInterface {
    id: number;
    customer: string;
    status: OrderStatus;
    priority: OrderPriority;
    createdAt: string;
    items: string[];
    statusHistory: { status: OrderStatus; timestamp: string }[];
}

export type { OrderPriority, OrderStatus, OutgoingOrderInterface };
