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

// Status is no longer color-coded. It reads as position on the board, as a
// stamp on the detail sheet, and as a row in the ledger — so the old
// STATUS_COLORS map (which duplicated the theme palette and was the one that
// actually rendered) has no remaining consumer.

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
