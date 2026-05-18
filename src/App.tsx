import './App.css';
import { Box } from '@mui/material';
import AppBar from './components/AppBar';
import OrdersSummary from './components/OrdersSummary/OrdersSummary';

function App() {
    return (
        <Box>
         <AppBar/>  
         <OrdersSummary/>
        </Box>
    );
}

export default App;
