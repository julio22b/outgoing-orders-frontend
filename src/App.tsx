import './App.css';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Stack } from '@mui/material';
import AppBar from './components/AppBar';
import OrdersSummary from './components/OrdersSummary/OrdersSummary';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DataGrid from './components/DataGrid/DataGrid';

function App() {
    const [status, setStatus] = useState('all');
    const [priority, setPriority] = useState('all');
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

    return (
        <Box>
            <AppBar />
            <OrdersSummary />
            <TextField fullWidth placeholder='Search orders...' type='search' />
            <FormControl fullWidth>
                <InputLabel id='status-select'>Status</InputLabel>
                <Select
                    labelId='status-select'
                    id='status-select'
                    value={status}
                    label='Status'
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <MenuItem value={'all'}>All statuses</MenuItem>
                    <MenuItem value={'picking'}>Picking</MenuItem>
                    <MenuItem value={'packed'}>Packed</MenuItem>
                    <MenuItem value={'dispatched'}>Dispatched</MenuItem>
                    <MenuItem value={'delayed'}>Delayed</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id='priority-select'>Priority</InputLabel>
                <Select
                    labelId='priority-select'
                    id='priority-select'
                    value={priority}
                    label='Priority'
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <MenuItem value={'all'}>All priorities</MenuItem>
                    <MenuItem value={'high'}>High</MenuItem>
                    <MenuItem value={'normal'}>Normal</MenuItem>
                    <MenuItem value={'low'}>Low</MenuItem>
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}> 
                <Stack spacing={3} sx={{ mt: 2 }}> 
                    <DatePicker label='Controlled picker'
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)} />
                </Stack>
            </LocalizationProvider>
            <DataGrid/>
        </Box>
    );
}

export default App;
