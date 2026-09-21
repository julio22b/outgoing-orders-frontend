import { Box, Button, Dialog, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { OutgoingOrderInterface, UpdateOrderBody } from '../../app/types';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { ORDER_STATUSES, ORDER_FIELDS, ORDER_FIELD_LABELS, ORDER_PRIORITIES } from '../../app/constants';
import {
    editingStarted,
    editingStopped,
    orderChangedWhileEditingDismissed,
} from '../../features/slices/outgoingOrdersSlice';
import { openSnackbar } from '../../features/slices/snackbarSlice';
import { readFailure, useCreateOrderMutation, useUpdateOrderMutation } from '../../api/ordersApi';
import LoadingOverlay from '../common/LoadingOverlay';
import Field from '../common/Field';
import Rule from '../common/Rule';
import { controlSx } from '../common/fieldStyles';
import { pluralize } from '../../app/utils';
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

const OutgoingOrdersForm = ({ isCreateOutgoingOrderFormOpen, closeForm, orderToEdit }: OutgoingOrdersFormInterface) => {
    const dispatch = useAppDispatch();
    const orderChangedWhileEditing = useAppSelector((state) => state.outgoingOrders.orderChangedWhileEditing);
    const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
    const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
    const saving = isCreating || isUpdating;

    const [order, setOrder] = useState<OutgoingOrderInterface>({
        id: 0,
        [ORDER_FIELDS.CUSTOMER]: '',
        [ORDER_FIELDS.STATUS]: ORDER_STATUSES.PICKING,
        [ORDER_FIELDS.PRIORITY]: ORDER_PRIORITIES.NORMAL,
        [ORDER_FIELDS.CREATED_AT]: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
        version: 1,
        [ORDER_FIELDS.ITEMS]: [],
        [ORDER_FIELDS.STATUS_HISTORY]: [],
        ...(orderToEdit && orderToEdit),
    });
    const [productName, setProductName] = useState('');
    const [errors, setErrors] = useState<FormErrorsInterface>({ customer: '', item: '' });
    const isEditForm = Boolean(orderToEdit);

    const editingOrderId = orderToEdit?.id;

    useEffect(() => {
        if (!isCreateOutgoingOrderFormOpen || editingOrderId === undefined) return;
        dispatch(editingStarted(editingOrderId));
        return () => {
            dispatch(editingStopped());
        };
    }, [dispatch, isCreateOutgoingOrderFormOpen, editingOrderId]);

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();

        if (!order.customer) {
            setErrors({ ...errors, customer: 'Enter a customer name' });
            return;
        }

        const body = {
            customer: order.customer,
            status: order.status,
            priority: order.priority,
            createdAt: order.createdAt,
            items: order.items,
        };

        if (isEditForm) {
            await saveEdit({ ...body, id: order.id, version: order.version });
            return;
        }

        const { error } = await createOrder(body);
        if (!error) {
            closeForm();
        }
    };

    const saveEdit = async (body: UpdateOrderBody) => {
        const { error } = await updateOrder(body);
        if (!error) {
            closeForm();
            return;
        }

        const theirs = readFailure(error).conflict;
        if (!theirs) return;

        setOrder(theirs);
        dispatch(openSnackbar('Someone else saved this order first. The form now shows their version.'));
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

    const reloadFromServerVersion = () => {
        if (orderChangedWhileEditing) {
            setOrder(orderChangedWhileEditing);
        }
        dispatch(orderChangedWhileEditingDismissed());
    };

    const handleClose = () => {
        closeForm();
        setProductName('');
    };

    const closeUnlessSaving = saving ? undefined : handleClose;

    const lineGutter = '13px';

    return (
        <Dialog open={isCreateOutgoingOrderFormOpen} onClose={closeUnlessSaving} fullWidth maxWidth='sm'>
            <Box sx={{ position: 'relative' }}>
                {saving && <LoadingOverlay absolute message='Saving order' />}

                <Box component='form' onSubmit={(e) => e.preventDefault()} sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
                        <Typography variant='masthead' component='h2' sx={{ fontSize: '1.75rem' }}>
                            {isEditForm ? 'Edit order' : 'New order'}
                        </Typography>
                        {isEditForm && (
                            <Typography variant='data' sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                ORD-{order.id}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            border: rule.mid,
                            backgroundColor: colors.field,
                            mt: 2,
                        }}
                    >
                        <Field
                            label={ORDER_FIELD_LABELS.customer}
                            htmlFor='order-customer'
                            required
                            sx={{ gridColumn: '1 / -1', borderBottom: rule.hair }}
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
                            label={ORDER_FIELD_LABELS.priority}
                            htmlFor='order-priority'
                            sx={{ borderRight: { sm: rule.hair }, borderBottom: { xs: rule.hair, sm: 'none' } }}
                        >
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
                        <Field label='Date' htmlFor='order-date'>
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

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            gap: 2,
                            mt: 4,
                            mb: 1,
                        }}
                    >
                        <Typography variant='section' component='h3'>
                            Items
                        </Typography>
                        <Typography variant='data' sx={{ color: 'text.secondary' }}>
                            {pluralize(order.items.length, 'item')}
                        </Typography>
                    </Box>
                    <Rule weight='mid' />

                    {order.items.map((item, index) => (
                        <Box key={item}>
                            {index > 0 && <Rule weight='hair' />}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2.5,
                                    py: 1,
                                    pl: lineGutter,
                                    pr: 0.5,
                                }}
                            >
                                <Typography variant='data' sx={{ color: 'text.disabled', flexShrink: 0 }}>
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
                                    sx={{ typography: 'label', minHeight: 24, px: 1 }}
                                >
                                    Remove
                                </Button>
                            </Box>
                        </Box>
                    ))}

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            border: rule.mid,
                            backgroundColor: colors.field,
                            mt: order.items.length > 0 ? 1 : 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2.5,
                                px: 1.5,
                                py: 1.25,
                                '&:focus-within': { outline: `2px solid ${colors.ink}`, outlineOffset: '-2px' },
                            }}
                        >
                            <Typography variant='data' aria-hidden sx={{ color: 'text.disabled', flexShrink: 0 }}>
                                {String(order.items.length + 1).padStart(2, '0')}
                            </Typography>
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
                                slotProps={{
                                    htmlInput: { 'aria-label': 'Item name', 'aria-describedby': 'order-item-hint' },
                                }}
                                sx={controlSx}
                            />
                        </Box>
                        <Button
                            onClick={commitProduct}
                            sx={{
                                borderLeft: rule.hair,
                                px: 2.5,
                                minHeight: 0,
                                color: 'text.primary',
                                '&:hover': { backgroundColor: colors.ink, color: colors.paper },
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                    <Typography
                        id='order-item-hint'
                        variant='body2'
                        sx={{ color: errors.item ? colors.stamp : 'text.secondary', mt: 0.75, pl: lineGutter }}
                    >
                        {errors.item || 'Press Enter to add'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 4 }}>
                        <Button variant='text' onClick={handleClose} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant='contained' onClick={onSubmit} disabled={saving}>
                            {isEditForm ? 'Save changes' : 'Create order'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Dialog open={Boolean(orderChangedWhileEditing)} onClose={reloadFromServerVersion} maxWidth='xs'>
                <Box sx={{ p: 3 }}>
                    <Typography variant='section' component='h2'>
                        This order changed
                    </Typography>
                    <Rule weight='mid' sx={{ my: 1.5 }} />
                    <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                        Someone else saved changes to this order, so the form will be reloaded with their version.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button variant='contained' onClick={reloadFromServerVersion}>
                            OK
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </Dialog>
    );
};

export default OutgoingOrdersForm;
