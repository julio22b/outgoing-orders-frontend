import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from '@mui/material';
import { useState } from 'react';
import type { OutgoingOrderInterface } from '../../app/types/types';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ORDER_STATUSES, ORDER_FIELDS, ORDER_PRIORITIES } from '../../app/constants';
import { addOutgoingOrder } from '../../features/slices/outgoingOrdersSlice';

interface OutgoingOrdersFormInterface {
    isCreateOutgoingOrderFormOpen: boolean;
    closeForm: () => void;
}

const generateOrderId = (orders: OutgoingOrderInterface[]) => {
    const highest = orders.reduce((max, order) => {
        const num = parseInt(order.id.replace('ORD-', ''));
        return !isNaN(num) && num > max ? num : max;
    }, 0);
    return `ORD-${highest + 1}`;
};

const OutgoingOrdersForm = ({ isCreateOutgoingOrderFormOpen, closeForm }: OutgoingOrdersFormInterface) => {
    const orders = useAppSelector((state) => state.outgoingOrders.orders);
    const dispatch = useAppDispatch();
    const nextId = generateOrderId(orders);

    const [order, setOrder] = useState<OutgoingOrderInterface>({
        id: nextId,
        [ORDER_FIELDS.CUSTOMER]: '',
        [ORDER_FIELDS.STATUS]: ORDER_STATUSES.PICKING,
        [ORDER_FIELDS.PRIORITY]: ORDER_PRIORITIES.NORMAL,
        [ORDER_FIELDS.CREATED_AT]: dayjs().toISOString(),
    });
    const [errors, setErrors] = useState({ customer: '' });

    const isCreateButtonDisabled = !order.customer;

    const onSubmit = () => {
        if (!order.customer) {
            setErrors({ customer: 'Customer is required' });
            return;
        }
        dispatch(addOutgoingOrder(order));
        closeForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder({ ...order, [name]: value });

        if (name === ORDER_FIELDS.CUSTOMER) {
            setErrors({ ...errors, [name]: value ? '' : 'Customer is required' });
        }
    };

    return (
        <Dialog open={isCreateOutgoingOrderFormOpen} onClose={closeForm} fullWidth>
            <DialogTitle>Create new order</DialogTitle>
            <DialogContent sx={{ pt: '16px !important' }}>
                <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
                    <TextField value={order.id} label='Order ID' fullWidth slotProps={{ input: { readOnly: true } }} />
                    <TextField
                        value={order.customer}
                        label='Customer'
                        required
                        onChange={(e) => handleChange(e)}
                        placeholder='Enter customer name'
                        fullWidth
                        name={ORDER_FIELDS.CUSTOMER}
                        error={!!errors.customer}
                        helperText={errors.customer}
                    />
                    <FormControl fullWidth>
                        <InputLabel id={'priority-select'}>Priority</InputLabel>
                        <Select
                            labelId={'priority-select'}
                            id={'priority-select'}
                            value={order.priority}
                            label={ORDER_FIELDS.PRIORITY}
                            onChange={(e) => setOrder({ ...order, priority: e.target.value })}
                        >
                            {Object.values(ORDER_PRIORITIES).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {`${option[0].toUpperCase()}${option.slice(1)}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DatePicker
                                label='Date'
                                value={order.createdAt ? dayjs(order.createdAt) : null}
                                minDate={dayjs()}
                                onChange={(newValue) =>
                                    setOrder({
                                        ...order,
                                        createdAt: newValue ? newValue.toISOString() : dayjs().toISOString(),
                                    })
                                }
                            />
                        </Stack>
                    </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeForm} color='secondary' variant='outlined'>
                    Cancel
                </Button>
                <Button variant='contained' onClick={onSubmit} color='primary' disabled={isCreateButtonDisabled}>
                    Create Order
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OutgoingOrdersForm;
