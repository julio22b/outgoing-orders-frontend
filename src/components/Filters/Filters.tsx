import { Box, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SelectFilter from './SelectFilter/SelectFilter';
import Field from '../common/Field';
import { controlSx } from '../common/fieldStyles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    statusFilterChanged,
    priorityFilterChanged,
    dateFilterChanged,
    searchFilterChanged,
} from '../../features/slices/filtersSlice';
import { ALL_FILTER, ORDER_FIELD_LABELS, ORDER_PRIORITIES, VISIBLE_ORDER_STATUSES } from '../../app/constants';
import { isSearchTooShort } from '../../features/orders/orderFilters';
import { colors, rule } from '../../app/theme';

const cellSx = {
    borderRight: { md: rule.hair },
    borderBottom: { xs: rule.hair, md: 'none' },
    '&:last-of-type': { borderRight: 'none', borderBottom: 'none' },
};

const Filters = () => {
    const { date, priority, search, status } = useAppSelector((state) => state.filters);
    const dispatch = useAppDispatch();

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
                border: rule.mid,
                backgroundColor: colors.field,
            }}
        >
            <Field label='Search' htmlFor='filter-search' sx={cellSx}>
                <TextField
                    id='filter-search'
                    value={search}
                    onChange={(e) => dispatch(searchFilterChanged(e.target.value))}
                    placeholder='Order number or customer'
                    type='search'
                    helperText={isSearchTooShort(search) ? 'Type 3+ characters, or an order number' : undefined}
                    fullWidth
                    sx={controlSx}
                />
            </Field>

            <Field label={ORDER_FIELD_LABELS.status} htmlFor='filter-status' sx={cellSx}>
                <SelectFilter
                    id='filter-status'
                    value={status}
                    options={[ALL_FILTER, ...VISIBLE_ORDER_STATUSES]}
                    handleChange={(value) => dispatch(statusFilterChanged(value))}
                />
            </Field>

            <Field label={ORDER_FIELD_LABELS.priority} htmlFor='filter-priority' sx={cellSx}>
                <SelectFilter
                    id='filter-priority'
                    value={priority}
                    options={[ALL_FILTER, ...Object.values(ORDER_PRIORITIES)]}
                    handleChange={(value) => dispatch(priorityFilterChanged(value))}
                />
            </Field>

            <Field label='Date' htmlFor='filter-date' sx={cellSx}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={date ? dayjs(date) : null}
                        onChange={(newValue) => dispatch(dateFilterChanged(newValue ? newValue.toISOString() : null))}
                        slotProps={{
                            textField: { id: 'filter-date', fullWidth: true, sx: controlSx },
                            openPickerButton: { size: 'small' },
                        }}
                    />
                </LocalizationProvider>
            </Field>
        </Box>
    );
};

export default Filters;
