import './App.css';
import { Box, Snackbar } from '@mui/material';
import AppBar from './components/AppBar';
import OrdersSummary from './components/OrdersSummary/OrdersSummary';
import DataGrid from './components/DataGrid/DataGrid';
import Filters from './components/Filters/Filters';
import { Route, Routes } from 'react-router-dom';
import OutgoingOrderDetails from './components/OutgoingOrderDetails/OutgoingOrderDetails';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { addOrder, fetchOrders, removeOrder, updateOrderInStore } from './features/slices/outgoingOrdersSlice';
import socket from './socket';
import type { OutgoingOrderInterface } from './app/types';
import { closeSnackbar } from './features/slices/snackbarSlice';

function App() {
    const { vertical, horizontal, open, message } = useAppSelector((state) => state.snackbar);
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
                            <DataGrid />
                        </>
                    }
                />
                <Route path='/orders/:id' element={<OutgoingOrderDetails />} />
            </Routes>
        </Box>
    );
}

export default App;
