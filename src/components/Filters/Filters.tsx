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
import { ORDER_PRIORITIES, ORDER_STATUSES } from '../../app/constants';
import { colors, rule } from '../../app/theme';

/** This band breaks to one column at md, so it rules its own edges rather than sharing. */
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
                borderTop: 'none',
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
                    fullWidth
                    sx={controlSx}
                />
            </Field>

            <Field label='Status' htmlFor='filter-status' sx={cellSx}>
                <SelectFilter
                    id='filter-status'
                    value={status}
                    options={['all', ...Object.values(ORDER_STATUSES)]}
                    handleChange={(value) => dispatch(statusFilterChanged(value))}
                />
            </Field>

            <Field label='Priority' htmlFor='filter-priority' sx={cellSx}>
                <SelectFilter
                    id='filter-priority'
                    value={priority}
                    options={['all', ...Object.values(ORDER_PRIORITIES)]}
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
