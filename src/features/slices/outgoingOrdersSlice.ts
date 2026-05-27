import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OutgoingOrderInterface } from '../../app/types';

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
            statusHistory: [{ status: 'picking', timestamp: '2026-05-20T08:14:00' }],
            products: ['Wireless Mouse', 'Mechanical Keyboard'],
        },
        {
            id: 'ORD-1041',
            customer: 'Global Trade Co.',
            status: 'packed',
            priority: 'normal',
            createdAt: '2026-05-20T07:52:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-20T07:52:00' },
                { status: 'packed', timestamp: '2026-05-20T09:45:00' },
            ],
            products: ['Monitor Stand', 'LED Desk Lamp', 'USB-C Hub'],
        },
        {
            id: 'ORD-1040',
            customer: 'Blue Harbor Inc.',
            status: 'picking',
            priority: 'normal',
            createdAt: '2026-05-20T07:30:00',
            statusHistory: [{ status: 'picking', timestamp: '2026-05-20T07:30:00' }],
            products: ['Webcam 1080p'],
        },
        {
            id: 'ORD-1039',
            customer: 'NorthStar Supply',
            status: 'delayed',
            priority: 'high',
            createdAt: '2026-05-19T16:30:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-19T16:30:00' },
                { status: 'delayed', timestamp: '2026-05-19T19:15:00' },
            ],
            products: ['Noise Cancelling Headphones', 'External SSD 1TB'],
        },
        {
            id: 'ORD-1038',
            customer: 'Meridian Goods',
            status: 'dispatched',
            priority: 'normal',
            createdAt: '2026-05-19T14:05:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-19T14:05:00' },
                { status: 'packed', timestamp: '2026-05-19T16:20:00' },
                { status: 'dispatched', timestamp: '2026-05-19T18:40:00' },
            ],
            products: ['Laptop Sleeve', 'Portable Charger'],
        },
        {
            id: 'ORD-1037',
            customer: 'Vertex Wholesale',
            status: 'dispatched',
            priority: 'low',
            createdAt: '2026-05-19T11:20:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-19T11:20:00' },
                { status: 'packed', timestamp: '2026-05-19T13:10:00' },
                { status: 'dispatched', timestamp: '2026-05-19T15:55:00' },
            ],
            products: ['Wireless Mouse', 'Monitor Stand'],
        },
        {
            id: 'ORD-1036',
            customer: 'Ironclad Freight',
            status: 'packed',
            priority: 'high',
            createdAt: '2026-05-19T10:45:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-19T10:45:00' },
                { status: 'packed', timestamp: '2026-05-19T12:30:00' },
            ],
            products: ['USB-C Hub', 'Webcam 1080p', 'Laptop Sleeve'],
        },
        {
            id: 'ORD-1035',
            customer: 'Sunrise Exports',
            status: 'dispatched',
            priority: 'normal',
            createdAt: '2026-05-19T09:10:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-19T09:10:00' },
                { status: 'packed', timestamp: '2026-05-19T11:00:00' },
                { status: 'dispatched', timestamp: '2026-05-19T13:25:00' },
            ],
            products: ['Mechanical Keyboard', 'LED Desk Lamp'],
        },
        {
            id: 'ORD-1034',
            customer: 'Delta Warehousing',
            status: 'delayed',
            priority: 'high',
            createdAt: '2026-05-18T17:55:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-18T17:55:00' },
                { status: 'delayed', timestamp: '2026-05-18T21:30:00' },
            ],
            products: ['External SSD 1TB', 'Portable Charger'],
        },
        {
            id: 'ORD-1033',
            customer: 'Coastal Traders',
            status: 'picking',
            priority: 'low',
            createdAt: '2026-05-18T15:40:00',
            statusHistory: [{ status: 'picking', timestamp: '2026-05-18T15:40:00' }],
            products: ['Noise Cancelling Headphones'],
        },
        {
            id: 'ORD-1032',
            customer: 'Summit Distribution',
            status: 'packed',
            priority: 'normal',
            createdAt: '2026-05-18T13:22:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-18T13:22:00' },
                { status: 'packed', timestamp: '2026-05-18T15:10:00' },
            ],
            products: ['Wireless Mouse', 'USB-C Hub'],
        },
        {
            id: 'ORD-1031',
            customer: 'Redline Cargo',
            status: 'dispatched',
            priority: 'low',
            createdAt: '2026-05-18T11:05:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-18T11:05:00' },
                { status: 'packed', timestamp: '2026-05-18T13:00:00' },
                { status: 'dispatched', timestamp: '2026-05-18T15:20:00' },
            ],
            products: ['Mechanical Keyboard', 'Webcam 1080p'],
        },
        {
            id: 'ORD-1030',
            customer: 'Pinnacle Supply Co.',
            status: 'delayed',
            priority: 'normal',
            createdAt: '2026-05-18T09:30:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-18T09:30:00' },
                { status: 'delayed', timestamp: '2026-05-18T13:45:00' },
            ],
            products: ['Monitor Stand', 'Laptop Sleeve'],
        },
        {
            id: 'ORD-1029',
            customer: 'Keystone Logistics',
            status: 'picking',
            priority: 'high',
            createdAt: '2026-05-17T16:15:00',
            statusHistory: [{ status: 'picking', timestamp: '2026-05-17T16:15:00' }],
            products: ['LED Desk Lamp', 'Portable Charger', 'External SSD 1TB'],
        },
        {
            id: 'ORD-1028',
            customer: 'Westfield Goods',
            status: 'dispatched',
            priority: 'normal',
            createdAt: '2026-05-17T14:00:00',
            statusHistory: [
                { status: 'picking', timestamp: '2026-05-17T14:00:00' },
                { status: 'packed', timestamp: '2026-05-17T16:10:00' },
                { status: 'dispatched', timestamp: '2026-05-17T18:30:00' },
            ],
            products: ['Wireless Mouse', 'Noise Cancelling Headphones'],
        },
    ],
};

export const outgoingOrdersSlice = createSlice({
    name: 'outgoingOrders',
    initialState,
    reducers: {
        addOutgoingOrder: (state, action: PayloadAction<OutgoingOrderInterface>) => {
            state.orders.unshift(action.payload);
        },
        removeOutgoingOrder: (state, action: PayloadAction<string>) => {
            state.orders = state.orders.filter((order) => order.id !== action.payload);
        },
    },
});

export const { addOutgoingOrder, removeOutgoingOrder } = outgoingOrdersSlice.actions;

export default outgoingOrdersSlice.reducer;
