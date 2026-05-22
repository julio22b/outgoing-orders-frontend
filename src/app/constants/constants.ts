import type { DataGridHeadersInterface } from "../types/types";


export const ORDER_STATUSES = {
    PICKING: 'picking',
    PACKED: 'packed',
    DELAYED: 'delayed',
    DISPATCHED: 'dispatched',
};

export const DATA_GRID_HEADERS: DataGridHeadersInterface[] = [
    { title: 'Order ID', id: ' order-id' },
    { title: 'Customer', id: 'customer' },
    { title: 'Status', id: 'status' },
    { title: 'Priority', id: 'priority' },
    { title: 'Created', id: 'created' },
];