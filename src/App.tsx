import './App.css';
import { Box } from '@mui/material';
import AppBar from './components/AppBar';
import OrdersSummary from './components/OrdersSummary/OrdersSummary';
import DataGrid from './components/DataGrid/DataGrid';
import Filters from './components/Filters/Filters';

function App() {
    return (
        <Box>
            <AppBar />
            <OrdersSummary />
            <Filters />
            <DataGrid />
        </Box>
    );
}

export default App;
