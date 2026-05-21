import './App.css';
import { Box } from '@mui/material';
import AppBar from './components/AppBar';
import OrdersSummary from './components/OrdersSummary/OrdersSummary';
import DataGrid from './components/DataGrid/DataGrid';
import Filters from './components/Filters/Filters';
import { DATA_GRID_ROWS } from './app/constants/constants';

function App() {
    return (
        <Box>
            <AppBar />
            <OrdersSummary />
            <Filters />
            <DataGrid rows={DATA_GRID_ROWS} />
        </Box>
    );
}

export default App;
