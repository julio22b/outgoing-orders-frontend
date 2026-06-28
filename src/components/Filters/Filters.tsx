import { Box, TextField, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SelectFilter from './SelectFilter/SelectFilter';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    statusFilterChanged,
    priorityFilterChanged,
    dateFilterChanged,
    searchFilterChanged,
} from '../../features/slices/filtersSlice';
import { ORDER_FIELDS, ORDER_PRIORITIES, ORDER_STATUSES } from '../../app/constants';

const Filters = () => {
    const { date, priority, search, status } = useAppSelector((state) => state.filters);
    const dispatch = useAppDispatch();

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, padding: '2em', gap: '1em', alignItems: { md: 'center' } }}>
            <TextField
                value={search}
                onChange={(e) => dispatch(searchFilterChanged(e.target.value))}
                placeholder='Search orders...'
                type='search'
                sx={{ flex: { md: 2 } }}
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
            <Box sx={{ display: 'flex', gap: '1em', flexWrap: 'wrap', flex: { md: 3 }, '& > *': { flex: 1, minWidth: '140px' } }}>
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
                    <DatePicker
                        label='Date'
                        value={date ? dayjs(date) : null}
                        onChange={(newValue) => dispatch(dateFilterChanged(newValue ? newValue.toISOString() : null))}
                    />
                </LocalizationProvider>
            </Box>
        </Box>
    );
};

export default Filters;
