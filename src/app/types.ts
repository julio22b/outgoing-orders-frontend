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

interface OrderFilterArgs {
    priority?: OrderPriority;
    search?: string;
    from?: string;
    to?: string;
}

interface ListOrdersArgs extends OrderFilterArgs {
    status: OrderStatus;
}

interface OrdersPage {
    data: OutgoingOrderInterface[];
    nextCursor: string | null;
}

interface OrdersSummary {
    // part of the /orders/summary response but unused: counts every status, delayed
    // included, whereas the tally line sums VISIBLE_ORDER_STATUSES
    total: number;
    byStatus: Record<OrderStatus, number>;
}

export type {
    ListOrdersArgs,
    OrderFilterArgs,
    OrderPriority,
    OrderStatus,
    OrdersPage,
    OrdersSummary,
    OutgoingOrderInterface,
};
