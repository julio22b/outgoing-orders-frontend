interface OutgoingOrderInterface {
    id: number;
    customer: string;
    status: string;
    priority: string;
    createdAt: string;
    items: string[];
    statusHistory: { status: 'picking' | 'packed' | 'delayed' | 'dispatched'; timestamp: string }[];
}

export type { OutgoingOrderInterface };
