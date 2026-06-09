import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, capitalize, Card, CardContent, CircularProgress, Divider, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomChip from '../DataGrid/CustomChip';
import { formatOrderDate } from '../../app/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import theme from '../../app/theme';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteOrder, fetchOrder, statusTransitionOrder } from '../../features/slices/outgoingOrdersSlice';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog.tsx/DeleteConfirmationDialog';
import { useEffect, useState } from 'react';
import ProductsList from './ProductsList';
import CircleIcon from '@mui/icons-material/Circle';
import OutgoingOrdersForm from '../OutgoingOrdersForm/OutgoingOrdersForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { STATUS_TRANSITIONS, STATUSES_ENUM, TIMELINE_STATUSES } from '../../app/constants';

const OutgoingOrderDetails = () => {
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
    const [isCreateOutgoingOrderFormOpen, setIsCreateOutgoingOrderFormOpen] = useState(false);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const IdOfOrderToFetch = location.state.orderId;
    const { detailsLoading, detailsOrder: order } = useAppSelector((state) => state.outgoingOrders);
    const nextStatus = STATUS_TRANSITIONS[order?.status || ''];

    useEffect(() => {
        if (IdOfOrderToFetch) {
            dispatch(fetchOrder(IdOfOrderToFetch));
        }
    }, [dispatch, IdOfOrderToFetch]);

    if (detailsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!order) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '300px',
                    margin: '0 auto',
                }}
            >
                <Typography sx={{ textAlign: 'center', paddingTop: '4em' }} gutterBottom variant='h4'>
                    No order found
                </Typography>
                <Button onClick={() => navigate(-1)} variant='outlined' color='secondary' startIcon={<ArrowBackIcon />}>
                    Back
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2em',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2em',
            }}
        >
            <Box
                sx={{
                    paddingTop: '2em',
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Box>
                    <Typography variant='h5'>{order.id}</Typography>
                    <Typography variant='subtitle1'>{order.customer}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <Button
                        onClick={() => setIsCreateOutgoingOrderFormOpen(true)}
                        variant='contained'
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => setIsDeleteOrderDialogOpen(true)}
                        variant='outlined'
                        color='warning'
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        variant='outlined'
                        color='secondary'
                        startIcon={<ArrowBackIcon />}
                    >
                        Back
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '1em', '& > *': { flex: 1 } }}>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography gutterBottom variant='h6'>
                            Status
                        </Typography>
                        <CustomChip title={order.status} />
                    </CardContent>
                </Card>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography gutterBottom variant='h6'>
                            Priority
                        </Typography>
                        <CustomChip title={order.priority} />
                    </CardContent>
                </Card>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography gutterBottom variant='h6'>
                            Date
                        </Typography>
                        {formatOrderDate(order.createdAt)}
                    </CardContent>
                </Card>
                <Card variant='outlined'>
                    <CardContent>
                        <Typography gutterBottom variant='h6'>
                            Items
                        </Typography>
                        {order.items.length}
                    </CardContent>
                </Card>
            </Box>
            <Card variant='outlined'>
                <CardContent>
                    <Typography gutterBottom variant='h6'>
                        Status timeline
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '1em', '& > *': { flex: 1 } }}>
                        {TIMELINE_STATUSES.map((status, index) => {
                            const currentStatusHistory = order.statusHistory.find(
                                (orderStatus) => orderStatus.status === status,
                            )!;

                            const isDone = STATUSES_ENUM[status] <= STATUSES_ENUM[currentStatusHistory?.status] || 0;
                            const color = isDone ? theme.palette.success.main : theme.palette.text.secondary;
                            const iconStyles = {
                                border: `1px solid ${theme.palette.secondary.main}`,
                                borderRadius: '50%',
                                color,
                            };
                            return (
                                <Box key={status} sx={{ position: 'relative' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            marginTop: '2em',
                                            gap: '1em',
                                        }}
                                    >
                                        {isDone ? (
                                            <CheckCircleIcon fontSize='large' sx={iconStyles} />
                                        ) : (
                                            <CircleIcon fontSize='large' sx={iconStyles} />
                                        )}
                                        <Typography color={color}>{capitalize(status)}</Typography>
                                        <Typography variant='subtitle2'>
                                            {currentStatusHistory
                                                ? formatOrderDate(currentStatusHistory.timestamp)
                                                : '—'}
                                        </Typography>
                                    </Box>
                                    {index !== 2 && (
                                        <Divider
                                            flexItem
                                            absolute
                                            sx={{
                                                top: '50%',
                                                left: '80%',
                                                right: '0',
                                                height: '3px',
                                                width: '50%',
                                                background: color,
                                            }}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                    {nextStatus && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
                            <Button
                                color='primary'
                                variant='contained'
                                onClick={() => dispatch(statusTransitionOrder(order.id))}
                            >
                                Mark as {capitalize(nextStatus)}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
            <ProductsList products={order.items} />
            <DeleteConfirmationDialog
                closeDialog={() => setIsDeleteOrderDialogOpen(false)}
                isOpen={isDeleteOrderDialogOpen}
                onDelete={() => {
                    dispatch(deleteOrder(order.id));
                    navigate('/');
                }}
                selectedOrder={order}
            />
            <OutgoingOrdersForm
                isCreateOutgoingOrderFormOpen={isCreateOutgoingOrderFormOpen}
                closeForm={() => setIsCreateOutgoingOrderFormOpen(false)}
                orderToEdit={order}
            />
        </Box>
    );
};

export default OutgoingOrderDetails;
