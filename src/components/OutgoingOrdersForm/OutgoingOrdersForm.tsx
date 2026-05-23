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
import { useAppSelector } from '../../app/hooks';

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
    const nextId = generateOrderId(orders);

    const [order, setOrder] = useState<OutgoingOrderInterface>({
        id: nextId,
        customer: '',
        status: 'picking',
        priority: 'normal',
        createdAt: dayjs().toISOString(),
    });

    return (
        <Dialog open={isCreateOutgoingOrderFormOpen} fullWidth>
            <DialogTitle>Create new order</DialogTitle>
            <DialogContent sx={{ pt: '16px !important' }}>
                <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
                    <TextField value={order.id} label='Order ID' disabled fullWidth />
                    <TextField
                        value={order.customer}
                        label='Customer'
                        onChange={(e) => setOrder({ ...order, customer: e.target.value })}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id={'priority-select'}>Priority</InputLabel>
                        <Select
                            labelId={'priority-select'}
                            id={'priority-select'}
                            value={order.priority}
                            label={'priority'}
                            onChange={(e) => setOrder({ ...order, priority: e.target.value })}
                        >
                            {['high', 'normal', 'low'].map((option) => (
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
                <Button onClick={closeForm} color='inherit' variant='outlined'>
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        closeForm();
                    }}
                    color='primary'
                >
                    Create Order
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OutgoingOrdersForm;
