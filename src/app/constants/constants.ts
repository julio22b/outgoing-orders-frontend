interface DataGridHeadersInterface {
    title: string;
    id: string;
}

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

export const DATA_GRID_ROWS = [
    {
        id: 'ORD-1042',
        customer: 'Acme Logistics',
        status: 'picking',
        priority: 'high',
        createdAt: '2026-05-20T08:14:00',
    },
    {
        id: 'ORD-1041',
        customer: 'Global Trade Co.',
        status: 'packed',
        priority: 'normal',
        createdAt: '2026-05-20T07:52:00',
    },
    {
        id: 'ORD-1040',
        customer: 'Blue Harbor Inc.',
        status: 'picking',
        priority: 'normal',
        createdAt: '2026-05-20T07:30:00',
    },
    {
        id: 'ORD-1039',
        customer: 'NorthStar Supply',
        status: 'delayed',
        priority: 'high',
        createdAt: '2026-05-19T16:30:00',
    },
    {
        id: 'ORD-1038',
        customer: 'Meridian Goods',
        status: 'dispatched',
        priority: 'normal',
        createdAt: '2026-05-19T14:05:00',
    },
    {
        id: 'ORD-1037',
        customer: 'Vertex Wholesale',
        status: 'dispatched',
        priority: 'low',
        createdAt: '2026-05-19T11:20:00',
    },
    {
        id: 'ORD-1036',
        customer: 'Ironclad Freight',
        status: 'packed',
        priority: 'high',
        createdAt: '2026-05-19T10:45:00',
    },
    {
        id: 'ORD-1035',
        customer: 'Sunrise Exports',
        status: 'dispatched',
        priority: 'normal',
        createdAt: '2026-05-19T09:10:00',
    },
    {
        id: 'ORD-1034',
        customer: 'Delta Warehousing',
        status: 'delayed',
        priority: 'high',
        createdAt: '2026-05-18T17:55:00',
    },
    {
        id: 'ORD-1033',
        customer: 'Coastal Traders',
        status: 'picking',
        priority: 'low',
        createdAt: '2026-05-18T15:40:00',
    },
    {
        id: 'ORD-1032',
        customer: 'Summit Distribution',
        status: 'packed',
        priority: 'normal',
        createdAt: '2026-05-18T13:22:00',
    },
    {
        id: 'ORD-1031',
        customer: 'Redline Cargo',
        status: 'dispatched',
        priority: 'low',
        createdAt: '2026-05-18T11:05:00',
    },
    {
        id: 'ORD-1030',
        customer: 'Pinnacle Supply Co.',
        status: 'delayed',
        priority: 'normal',
        createdAt: '2026-05-18T09:30:00',
    },
    {
        id: 'ORD-1029',
        customer: 'Keystone Logistics',
        status: 'picking',
        priority: 'high',
        createdAt: '2026-05-17T16:15:00',
    },
    {
        id: 'ORD-1028',
        customer: 'Westfield Goods',
        status: 'dispatched',
        priority: 'normal',
        createdAt: '2026-05-17T14:00:00',
    },
];