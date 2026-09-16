import { Snackbar } from '@mui/material';
import Letterhead from './components/Letterhead';
import TallyLine from './components/TallyLine';
import Filters from './components/Filters/Filters';
import { Route, Routes } from 'react-router-dom';
import OutgoingOrderDetails from './components/OutgoingOrderDetails/OutgoingOrderDetails';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import socket from './socket';
import type { OutgoingOrderInterface } from './app/types';
import { closeSnackbar } from './features/slices/snackbarSlice';
import { applyOrderEvent, cancelSummaryRefresh } from './features/orders/orderEvents';
import { useGetOrdersSummaryQuery } from './api/ordersApi';
import LoadingOverlay from './components/common/LoadingOverlay';
import Board from './components/Board/Board';
import Sheet from './components/common/Sheet';

function App() {
    const { vertical, horizontal, open, message } = useAppSelector((state) => state.snackbar);
    const { isLoading: isWakingServer } = useGetOrdersSummaryQuery({});
    const dispatch = useAppDispatch();

    useEffect(() => {
        socket.on('order:created', (order: OutgoingOrderInterface) => {
            dispatch(applyOrderEvent({ type: 'created', order }));
        });

        socket.on('order:updated', (order: OutgoingOrderInterface) => {
            dispatch(applyOrderEvent({ type: 'updated', order }));
        });

        socket.on('order:deleted', (orderId: number) => {
            dispatch(applyOrderEvent({ type: 'deleted', orderId }));
        });

        return () => {
            socket.off('order:created');
            socket.off('order:updated');
            socket.off('order:deleted');
            cancelSummaryRefresh();
        };
    }, [dispatch]);

    if (isWakingServer) {
        return (
            <LoadingOverlay
                message='Waking the server'
                subMessage='It spins down after inactivity, so the first request takes 30–60 seconds. Later ones are fast.'
            />
        );
    }

    return (
        <Sheet>
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
                        <>
                            <TallyLine />
                            <Filters />
                            <Board />
                        </>
                    }
                />
                <Route path='/orders/:id' element={<OutgoingOrderDetails />} />
            </Routes>
        </Sheet>
    );
}

export default App;
