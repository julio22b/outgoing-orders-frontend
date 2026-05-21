interface OrderInterface {
    id: string;
    customer: string;
    status: string;
    priority: string;
    createdAt: string;
}

interface DataGridHeadersInterface {
    title: string;
    id: string;
}

export type { OrderInterface, DataGridHeadersInterface };