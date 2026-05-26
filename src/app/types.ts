interface OutgoingOrderInterface {
    id: string;
    customer: string;
    status: string;
    priority: string;
    createdAt: string;
    products: string[];
    statusHistory: { status: string; timestamp: string }[];
}

interface DataGridHeadersInterface {
    title: string;
    id: string;
    width?: string;
}

export type { OutgoingOrderInterface, DataGridHeadersInterface };
