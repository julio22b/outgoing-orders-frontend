import { Box, TextField, Stack, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SelectFilter from './SelectFilter/SelectFilter';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { statusFilterChanged, priorityFilterChanged, dateFilterChanged, searchFilterChanged } from '../../features/slices/filtersSlice';
import { ORDER_FIELDS, ORDER_PRIORITIES, ORDER_STATUSES } from '../../app/constants';

const Filters = () => {
    const { date, priority, search, status } = useAppSelector((state) => state.filters);
    const dispatch = useAppDispatch()

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '2em 1em', gap: '1.5em' }}>
            <TextField
                value={search}
                onChange={(e) => dispatch(searchFilterChanged(e.target.value))}
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
                name={ORDER_FIELDS.STATUS}
                value={status}
                options={['all', ...Object.values(ORDER_STATUSES)]}
                handleChange={(value) => dispatch(statusFilterChanged(value))}
            />
            <SelectFilter
                name={ORDER_FIELDS.PRIORITY}
                value={priority}
                options={['all', ...Object.values(ORDER_PRIORITIES)]}
                handleChange={(value) => dispatch(priorityFilterChanged(value))}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                    <DatePicker
                        label='Date'
                        value={date ? dayjs(date) : null}
                        onChange={(newValue) => dispatch(dateFilterChanged(newValue ? newValue.toISOString() : null))}
                    />
                </Stack>
            </LocalizationProvider>
        </Box>
    );
};

export default Filters;
