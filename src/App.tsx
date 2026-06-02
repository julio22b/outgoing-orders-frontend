import './App.css';
import { Box } from '@mui/material';
import AppBar from './components/AppBar';
import OrdersSummary from './components/OrdersSummary/OrdersSummary';
import DataGrid from './components/DataGrid/DataGrid';
import Filters from './components/Filters/Filters';
import { Route, Routes } from 'react-router-dom';
import OutgoingOrderDetails from './components/OutgoingOrderDetails/OutgoingOrderDetails';
import { useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { fetchOrders } from './features/slices/outgoingOrdersSlice';

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);
    
    return (
        <Box>
            <AppBar />
            <OrdersSummary />
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
