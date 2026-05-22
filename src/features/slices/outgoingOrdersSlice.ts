import { createSlice } from '@reduxjs/toolkit';
import type { OutgoingOrderInterface } from '../../app/types/types';

interface OutgoingOrdersInitialState {
    orders: OutgoingOrderInterface[];
}
const initialState: OutgoingOrdersInitialState = {
    orders: [
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
    ],
};

export const outgoingOrdersSlice = createSlice({
    name: 'outgoingOrders',
    initialState,
    reducers: {},
});

export default outgoingOrdersSlice.reducer;
