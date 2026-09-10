import { Box, Button, Dialog, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import type { OutgoingOrderInterface } from '../../app/types';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ORDER_STATUSES, ORDER_FIELDS, ORDER_PRIORITIES } from '../../app/constants';
import { createOrder, updateOrder } from '../../features/slices/outgoingOrdersSlice';
import LoadingOverlay from '../common/LoadingOverlay';
import Field from '../common/Field';
import Rule from '../common/Rule';
import { controlSx, sharedEdgeSx } from '../common/fieldStyles';
import { colors, rule } from '../../app/theme';

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

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();

        if (!order.customer) {
            setErrors({ ...errors, customer: 'Enter a customer name' });
            return;
        }

        if (isEditForm) {
            dispatch(updateOrder(order)).then(closeForm);
        } else {
            dispatch(
                createOrder({
                    ...order,
                    statusHistory: [{ status: ORDER_STATUSES.PICKING, timestamp: order.createdAt }],
                }),
            ).then(closeForm);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder({ ...order, [name]: value });

        if (name === ORDER_FIELDS.CUSTOMER) {
            setErrors({ ...errors, [name]: value ? '' : 'Enter a customer name' });
        }
    };

    const commitProduct = () => {
        if (!productName) return;
        if (order.items.includes(productName)) {
            setErrors({ ...errors, item: 'That item is already on the list' });
            return;
        }
        setOrder({ ...order, items: [...order.items, productName] });
        setProductName('');
    };

    const addProduct = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitProduct();
        }
    };

    const handleClose = () => {
        closeForm();
        setProductName('');
    };

    return (
        <Dialog open={isCreateOutgoingOrderFormOpen} onClose={handleClose} fullWidth maxWidth='sm'>
            <Box sx={{ position: 'relative' }}>
                {loading && <LoadingOverlay absolute message='Saving order' />}

                <Box sx={{ p: 3 }}>
                    <Typography variant='display' component='h2' sx={{ fontSize: '1.5rem' }}>
                        {isEditForm ? 'Edit order' : 'New order'}
                    </Typography>
                    <Rule weight='heavy' sx={{ mt: 1.5 }} />

                    <Box component='form' onSubmit={(e) => e.preventDefault()}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                                border: rule.mid,
                                borderTop: 'none',
                                backgroundColor: colors.field,
                            }}
                        >
                            <Field label='Order number' sx={sharedEdgeSx}>
                                <Typography variant='data'>ORD-{order.id}</Typography>
                            </Field>
                            <Field label='Priority' htmlFor='order-priority' sx={sharedEdgeSx}>
                                <Select
                                    id='order-priority'
                                    disabled={isEditForm}
                                    value={order.priority}
                                    onChange={(e) => setOrder({ ...order, priority: e.target.value })}
                                    fullWidth
                                    sx={controlSx}
                                >
                                    {Object.values(ORDER_PRIORITIES).map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {`${option[0].toUpperCase()}${option.slice(1)}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Field>
                            <Field label='Date' htmlFor='order-date' sx={sharedEdgeSx}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disabled={isEditForm}
                                        value={order.createdAt ? dayjs(order.createdAt) : null}
                                        minDate={isEditForm ? undefined : dayjs()}
                                        onChange={(newValue) =>
                                            setOrder({
                                                ...order,
                                                createdAt: newValue ? newValue.toISOString() : dayjs().toISOString(),
                                            })
                                        }
                                        slotProps={{
                                            textField: { id: 'order-date', fullWidth: true, sx: controlSx },
                                            openPickerButton: { size: 'small' },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Field>
                        </Box>

                        <Field
                            label='Customer'
                            htmlFor='order-customer'
                            bordered
                            sx={{ borderTop: 'none', mt: 2, border: rule.mid }}
                        >
                            <TextField
                                id='order-customer'
                                value={order.customer}
                                required
                                onChange={handleChange}
                                placeholder='Who the order ships to'
                                fullWidth
                                name={ORDER_FIELDS.CUSTOMER}
                                error={!!errors.customer}
                                helperText={errors.customer}
                                sx={controlSx}
                            />
                        </Field>

                        <Field
                            label='Add an item'
                            htmlFor='order-item'
                            sx={{ mt: 2, border: rule.mid, backgroundColor: colors.field }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <TextField
                                    id='order-item'
                                    fullWidth
                                    value={productName}
                                    onChange={(e) => {
                                        setProductName(e.target.value);
                                        setErrors({ ...errors, item: '' });
                                    }}
                                    onKeyDown={addProduct}
                                    placeholder='Item name'
                                    error={Boolean(errors.item)}
                                    helperText={errors.item || 'Press Enter to add'}
                                    sx={controlSx}
                                />
                                <Button variant='outlined' onClick={commitProduct} sx={{ minHeight: 28, py: 0 }}>
                                    Add
                                </Button>
                            </Box>
                        </Field>

                        {order.items.length > 0 && (
                            <Box sx={{ mt: 2.5 }}>
                                <Rule weight='mid' />
                                {order.items.map((item, index) => (
                                    <Box key={item}>
                                        {index > 0 && <Rule weight='hair' />}
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, py: 1, px: 1.5 }}>
                                            <Typography
                                                variant='data'
                                                sx={{ color: 'text.disabled', flexShrink: 0 }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </Typography>
                                            <Typography variant='body1' sx={{ flex: 1, overflowWrap: 'anywhere' }}>
                                                {item}
                                            </Typography>
                                            <Button
                                                variant='text'
                                                onClick={() =>
                                                    setOrder({
                                                        ...order,
                                                        items: order.items.filter((p) => p !== item),
                                                    })
                                                }
                                                sx={{ typography: 'label', minHeight: 24, px: 0.5 }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                            <Button variant='text' onClick={handleClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button variant='contained' onClick={onSubmit} disabled={loading}>
                                {isEditForm ? 'Save changes' : 'Create order'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Dialog>
    );
};

export default OutgoingOrdersForm;
