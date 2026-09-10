import { Box, Snackbar } from '@mui/material';
import Letterhead from './components/Letterhead';
import TallyLine from './components/TallyLine';
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
import Board from './components/Board/Board';
import Sheet from './components/common/Sheet';

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
                message='Waking the server'
                subMessage='It spins down after inactivity, so the first request takes 30–60 seconds. Later ones are fast.'
            />
        );
    }

    return (
        <Box>
            <Letterhead />
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
                        <Sheet>
                            <TallyLine />
                            <Filters />
                            <Board />
                        </Sheet>
                    }
                />
                <Route path='/orders/:id' element={<OutgoingOrderDetails />} />
            </Routes>
        </Box>
    );
}

export default App;
