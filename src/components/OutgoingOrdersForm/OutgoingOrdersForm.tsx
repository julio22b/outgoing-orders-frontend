import {
    Box,
    Button,
    Chip,
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
import React, { useState } from 'react';
import type { OutgoingOrderInterface } from '../../app/types';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ORDER_STATUSES, ORDER_FIELDS, ORDER_PRIORITIES } from '../../app/constants';
import { createOrder, updateOrder } from '../../features/slices/outgoingOrdersSlice';
import LoadingOverlay from '../common/LoadingOverlay';

interface OutgoingOrdersFormInterface {
    isCreateOutgoingOrderFormOpen: boolean;
    orderToEdit: OutgoingOrderInterface | null;
    closeForm: () => void;
}

interface FormErrorsInterface {
    customer: string;
    item: string;
}

const generateOrderId = (orders: OutgoingOrderInterface[]) => {
    const highest = orders.reduce((max, order) => {
        const num = order.id;
        return num > max ? num : max;
    }, 0);
    return highest + 1;
};

const OutgoingOrdersForm = ({ isCreateOutgoingOrderFormOpen, closeForm, orderToEdit }: OutgoingOrdersFormInterface) => {
    const { orders, loading } = useAppSelector((state) => state.outgoingOrders);
    const dispatch = useAppDispatch();
    const nextId = generateOrderId(orders);

    const [order, setOrder] = useState<OutgoingOrderInterface>({
        id: nextId,
        [ORDER_FIELDS.CUSTOMER]: '',
        [ORDER_FIELDS.STATUS]: ORDER_STATUSES.PICKING,
        [ORDER_FIELDS.PRIORITY]: ORDER_PRIORITIES.NORMAL,
        [ORDER_FIELDS.CREATED_AT]: dayjs().toISOString(),
        [ORDER_FIELDS.ITEMS]: [],
        [ORDER_FIELDS.STATUS_HISTORY]: [],
        ...(orderToEdit && orderToEdit),
    });
    const [productName, setProductName] = useState('');
    const [errors, setErrors] = useState<FormErrorsInterface>({ customer: '', item: '' });
    const isEditForm = Boolean(orderToEdit);
    const isCreateButtonDisabled = !order.customer || !order.items.length || loading;

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();

        if (!order.customer) {
            setErrors({ ...errors, customer: 'Customer is required' });
            return;
        }

        if (isEditForm) {
            dispatch(updateOrder(order));
        } else {
            dispatch(
                createOrder({
                    ...order,
                    statusHistory: [{ status: ORDER_STATUSES.PICKING, timestamp: order.createdAt }],
                }),
            );
        }
        closeForm();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder({ ...order, [name]: value });

        if (name === ORDER_FIELDS.CUSTOMER) {
            setErrors({ ...errors, [name]: value ? '' : 'Customer is required' });
        }
    };

    const addProduct = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const newProduct = (e.target as HTMLInputElement).value;
        if (!newProduct) return;

        const isProductAlreadyAdded = order.items.includes(newProduct);
        if (e.key === 'Enter') {
            if (isProductAlreadyAdded) {
                setErrors({ ...errors, item: 'This product has already been added.' });
                return;
            }
            setOrder({ ...order, items: [...order.items, newProduct] });
            setProductName('');
        }
    };

    const handleClose = () => {
        closeForm();
        setProductName('');
    };

    return (
        <Dialog open={isCreateOutgoingOrderFormOpen} onClose={handleClose} fullWidth>
            {loading && <LoadingOverlay />}
            <DialogTitle>Create new order</DialogTitle>
            <DialogContent sx={{ pt: '16px !important', position: 'relative' }}>
                <Box component='form' sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
                    <TextField
                        value={`ORD-${order.id}`}
                        label='Order ID'
                        fullWidth
                        slotProps={{ input: { readOnly: true } }}
                    />
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
                            disabled={isEditForm}
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
                                disabled={isEditForm}
                                value={order.createdAt ? dayjs(order.createdAt) : null}
                                minDate={isEditForm ? undefined : dayjs()}
                                onChange={(newValue) =>
                                    setOrder({
                                        ...order,
                                        createdAt: newValue ? newValue.toISOString() : dayjs().toISOString(),
                                    })
                                }
                            />
                        </Stack>
                    </LocalizationProvider>
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        {order.items.map((item) => (
                            <Chip
                                key={item}
                                label={item}
                                sx={{ fontSize: '14px' }}
                                onDelete={() => {
                                    setOrder({ ...order, items: order.items.filter((p) => p !== item) });
                                }}
                            />
                        ))}
                    </Box>
                    <TextField
                        label='Product'
                        required
                        value={productName}
                        onChange={(e) => {
                            setProductName(e.target.value);
                            setErrors({ ...errors, item: '' });
                        }}
                        onKeyDown={addProduct}
                        error={Boolean(errors.item)}
                        helperText={errors.item || 'Hit Enter to add'}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='secondary' variant='outlined' disabled={loading}>
                    Cancel
                </Button>
                <Button variant='contained' onClick={onSubmit} color='primary' disabled={isCreateButtonDisabled}>
                    {isEditForm ? 'Save' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OutgoingOrdersForm;
