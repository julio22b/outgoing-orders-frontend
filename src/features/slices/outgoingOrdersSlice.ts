import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderStatus, OutgoingOrderInterface } from '../../app/types';

const MARK_TTL_MS = 6000;

interface RecentChange {
    changedAt: number;
    isStatusChanged: boolean;
}

interface PendingWrite {
    count: number;
    isSuperseded: boolean;
}

interface OutgoingOrdersInitialState {
    lastEventAt: number | null;
    recentChanges: Record<number, RecentChange>;
    pendingWrites: Record<number, PendingWrite>;
    editingOrderId: number | null;
    orderChangedWhileEditing: OutgoingOrderInterface | null;
}

const initialState: OutgoingOrdersInitialState = {
    lastEventAt: null,
    recentChanges: {},
    pendingWrites: {},
    editingOrderId: null,
    orderChangedWhileEditing: null,
};

const clearChanges = (changes: Record<number, RecentChange>, now: number) => {
    for (const key of Object.keys(changes)) {
        const id = Number(key);
        if (now - changes[id].changedAt > MARK_TTL_MS) delete changes[id];
    }
};

const recordChange = (state: OutgoingOrdersInitialState, orderId: number, isStatusChanged: boolean) => {
    const now = Date.now();
    state.lastEventAt = now;
    clearChanges(state.recentChanges, now);
    state.recentChanges[orderId] = { changedAt: now, isStatusChanged };
};

export const outgoingOrdersSlice = createSlice({
    name: 'outgoingOrders',
    initialState,
    reducers: {
        summaryLoaded: (state) => {
            // starts the clock on first load; after that only changes move it
            state.lastEventAt ??= Date.now();
        },
        markOrderCreated: (state, action: PayloadAction<number>) => {
            recordChange(state, action.payload, false);
        },
        markOrderUpdated: (
            state,
            action: PayloadAction<{ order: OutgoingOrderInterface; previousStatus?: OrderStatus }>,
        ) => {
            const { order, previousStatus } = action.payload;

            if (state.editingOrderId === order.id && !(order.id in state.pendingWrites)) {
                state.orderChangedWhileEditing = order;
            }

            recordChange(state, order.id, previousStatus !== undefined && previousStatus !== order.status);
        },
        markOrderRemoved: (state, action: PayloadAction<number>) => {
            const now = Date.now();
            state.lastEventAt = now;
            clearChanges(state.recentChanges, now);
            delete state.recentChanges[action.payload];

            if (state.editingOrderId === action.payload) {
                state.editingOrderId = null;
                state.orderChangedWhileEditing = null;
            }
        },
        orderWritePending: (state, action: PayloadAction<number>) => {
            const pendingWrite = state.pendingWrites[action.payload];
            if (pendingWrite) {
                pendingWrite.count += 1;
            } else {
                state.pendingWrites[action.payload] = { count: 1, isSuperseded: false };
            }
        },
        orderWriteSuperseded: (state, action: PayloadAction<number>) => {
            const pendingWrite = state.pendingWrites[action.payload];
            if (pendingWrite) {
                pendingWrite.isSuperseded = true;
            }
        },
        orderWriteSettled: (state, action: PayloadAction<number>) => {
            const pendingWrite = state.pendingWrites[action.payload];
            if (!pendingWrite) return;

            pendingWrite.count -= 1;
            if (pendingWrite.count === 0) {
                delete state.pendingWrites[action.payload];
            }
        },
        editingStarted: (state, action: PayloadAction<number>) => {
            state.editingOrderId = action.payload;
            state.orderChangedWhileEditing = null;
        },
        editingStopped: (state) => {
            state.editingOrderId = null;
            state.orderChangedWhileEditing = null;
        },
        orderChangedWhileEditingDismissed: (state) => {
            state.orderChangedWhileEditing = null;
        },
    },
});

export const {
    summaryLoaded,
    markOrderCreated,
    markOrderUpdated,
    markOrderRemoved,
    orderWritePending,
    orderWriteSuperseded,
    orderWriteSettled,
    editingStarted,
    editingStopped,
    orderChangedWhileEditingDismissed,
} = outgoingOrdersSlice.actions;

export default outgoingOrdersSlice.reducer;
