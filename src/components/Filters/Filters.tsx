import { Box, TextField, Stack, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import SelectFilter from './SelectFilter/SelectFilter';

const Filters = () => {
    const [status, setStatus] = useState('all');
    const [priority, setPriority] = useState('all');
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '2em 1em', gap: '1.5em'}}>
            <TextField
                fullWidth
                placeholder='Search orders...'
                type='search'
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            <SelectFilter
                name='status'
                value={status}
                options={['all', 'picking', 'packed', 'dispatched', 'delayed']}
                setState={setStatus}
            />
            <SelectFilter
                name='priority'
                value={priority}
                options={['all', 'high', 'normal', 'low']}
                setState={setPriority}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                    <DatePicker
                        label='Controlled picker'
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                    />
                </Stack>
            </LocalizationProvider>
        </Box>
    );
};

export default Filters;
