import './App.css';
import { Box, Snackbar } from '@mui/material';
import AppBar from './components/AppBar';
import OrdersSummary from './components/OrdersSummary/OrdersSummary';
// import DataGrid from './components/DataGrid/DataGrid';
import Filters from './components/Filters/Filters';
import { Route, Routes } from 'react-router-dom';
import OutgoingOrderDetails from './components/OutgoingOrderDetails/OutgoingOrderDetails';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { addOrder, fetchOrders, removeOrder, updateOrderInStore } from './features/slices/outgoingOrdersSlice';
import socket from './socket';
import type { OutgoingOrderInterface } from './app/types';
import { closeSnackbar } from './features/slices/snackbarSlice';
import LoadingOverlay from './components/common/LoadingOverlay';
import KanbanBoard from './components/DataGrid/KanbanBoard';

function App() {
    const { vertical, horizontal, open, message } = useAppSelector((state) => state.snackbar);
    const initialized = useAppSelector((state) => state.outgoingOrders.initialized);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchOrders());

        socket.on('order:created', (order: OutgoingOrderInterface) => {
            dispatch(addOrder(order));
        });

        socket.on('order:updated', (order: OutgoingOrderInterface) => {
            dispatch(updateOrderInStore(order));
        });

        socket.on('order:deleted', (id: number) => {
            console.log('socket emit delete', id);
            dispatch(removeOrder(id));
        });

        return () => {
            socket.off('order:created');
            socket.off('order:updated');
            socket.off('order:deleted');
        };
    }, [dispatch]);

    if (!initialized) {
        return (
            <LoadingOverlay
                message='Server is waking up...'
                subMessage='The server spins down after inactivity. This takes a few seconds — hang tight!'
            />
        );
    }

    return (
        <Box>
            <AppBar />
            <OrdersSummary />
            <Snackbar
                autoHideDuration={6000}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={() => dispatch(closeSnackbar())}
                message={message}
                key={vertical + horizontal}
            />
            <Routes>
                <Route
                    path='/'
                    element={
                        <>
                            <Filters />
                            <KanbanBoard />
                            {/* <DataGrid /> */}
                        </>
                    }
                />
                <Route path='/orders/:id' element={<OutgoingOrderDetails />} />
            </Routes>
        </Box>
    );
}

export default App;
