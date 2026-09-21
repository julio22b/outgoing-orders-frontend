import { applyServerDeletion, applyServerOrder, findHeldOrder, scheduleSummaryRefresh } from '../../api/ordersApi';
import type { AppThunk } from '../../app/store';
import type { OutgoingOrderInterface } from '../../app/types';
import { markOrderCreated, markOrderRemoved, markOrderUpdated } from '../slices/outgoingOrdersSlice';

type OrderEvent =
    | { kind: 'created'; order: OutgoingOrderInterface }
    | { kind: 'updated'; order: OutgoingOrderInterface }
    | { kind: 'deleted'; orderId: number };

export const applyOrderEvent =
    (event: OrderEvent): AppThunk =>
    (dispatch, getState) => {
        if (event.kind === 'deleted') {
            dispatch(applyServerDeletion(event.orderId));
            dispatch(markOrderRemoved(event.orderId));
            scheduleSummaryRefresh(dispatch);
            return;
        }

        const heldOrder = findHeldOrder(getState(), event.order.id);

        const isNewerThanHeld = dispatch(applyServerOrder(event.order));
        if (!isNewerThanHeld) {
            return;
        }

        if (event.kind === 'created') {
            dispatch(markOrderCreated(event.order.id));
        } else {
            dispatch(markOrderUpdated({ order: event.order, previousStatus: heldOrder?.status }));
        }

        scheduleSummaryRefresh(dispatch);
    };
