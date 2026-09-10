import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import Stamp from '../common/Stamp';
import Rule from '../common/Rule';
import Field from '../common/Field';
import PackingList from './PackingList';
import LoadingOverlay from '../common/LoadingOverlay';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';
import OutgoingOrdersForm from '../OutgoingOrdersForm/OutgoingOrdersForm';
import { formatOrderStamp } from '../../app/utils';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteOrder, fetchOrder, updateOrderStatus } from '../../features/slices/outgoingOrdersSlice';
import { ORDER_PRIORITIES, STATUS_TRANSITIONS, TIMELINE_STATUSES } from '../../app/constants';
import { colors, rule } from '../../app/theme';

const specCellSx = {
    borderRight: { sm: rule.hair },
    borderBottom: { xs: rule.hair, sm: 'none' },
    '&:last-of-type': { borderRight: 'none', borderBottom: 'none' },
};

const OutgoingOrderDetails = () => {
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    // Read from the route, not from navigation state, so the URL can be shared
    // and the page survives a refresh.
    const { id } = useParams<{ id: string }>();
    const { detailsLoading, detailsOrder: order, recentChanges } = useAppSelector((state) => state.outgoingOrders);
    const nextStatus = STATUS_TRANSITIONS[order?.status || ''];

    useEffect(() => {
        if (id) dispatch(fetchOrder(id));
    }, [dispatch, id]);

    if (detailsLoading && !order) {
        return <LoadingOverlay message='Loading order' />;
    }

    if (!order) {
        return (
            <Box sx={{ py: 6 }}>
                <Typography variant='display' component='h1' gutterBottom>
                    No order here
                </Typography>
                <Typography variant='body1' sx={{ color: 'text.secondary', mb: 3, maxWidth: '52ch' }}>
                    This order number isn't on the manifest. It may have been dispatched and cleared, or deleted.
                </Typography>
                <Button variant='outlined' onClick={() => navigate('/')}>
                    Back to the board
                </Button>
            </Box>
        );
    }

    const received = formatOrderStamp(order.createdAt);
    const isHighPriority = order.priority === ORDER_PRIORITIES.HIGH;
    // Only stamp down when the change arrived from another client while watching.
    const justChangedStatus = recentChanges[order.id]?.statusChanged ?? false;

    return (
        <Box sx={{ position: 'relative' }}>
            {detailsLoading && <LoadingOverlay absolute />}
            <Box sx={{ pb: 8 }}>
                <Rule weight='heavy' />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { sm: 'flex-start' },
                        justifyContent: 'space-between',
                        gap: 3,
                        py: 3,
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant='docket' component='p'>
                            ORD-{order.id}
                        </Typography>
                        <Typography variant='display' component='h1' sx={{ mt: 1, overflowWrap: 'anywhere' }}>
                            {order.customer}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                        <Stamp
                            label={order.status}
                            tone='stamp'
                            size='lg'
                            animate={justChangedStatus}
                            sx={{ mt: { sm: 1 } }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button variant='outlined' onClick={() => setIsEditFormOpen(true)}>
                                Edit
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={() => setIsDeleteOrderDialogOpen(true)}
                                sx={{
                                    '&:hover': {
                                        borderColor: colors.stamp,
                                        backgroundColor: colors.stamp,
                                        color: colors.paper,
                                    },
                                }}
                            >
                                Delete
                            </Button>
                            <Button variant='text' onClick={() => navigate('/')}>
                                Back
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Rule weight='heavy' />

                {/* Status is deliberately absent — the stamp above already says it. */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                        border: rule.mid,
                        borderTop: 'none',
                        backgroundColor: colors.field,
                    }}
                >
                    <Field label='Priority' sx={specCellSx}>
                        <Typography
                            variant='body1'
                            sx={{ color: isHighPriority ? colors.stamp : 'text.primary', fontWeight: 500 }}
                        >
                            {capitalize(order.priority)}
                        </Typography>
                    </Field>
                    <Field label='Received' sx={specCellSx}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Typography variant='data'>{received.day}</Typography>
                            <Typography variant='data'>{received.time}</Typography>
                        </Box>
                    </Field>
                    <Field label='Items' sx={specCellSx}>
                        <Typography variant='data'>{order.items.length}</Typography>
                    </Field>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap',
                        mt: 5,
                        mb: 1,
                    }}
                >
                    <Typography variant='section' component='h2'>
                        Progress
                    </Typography>
                    {nextStatus && (
                        <Button variant='contained' onClick={() => dispatch(updateOrderStatus(order.id))}>
                            Mark as {nextStatus}
                        </Button>
                    )}
                </Box>
                <Rule weight='mid' />

                {TIMELINE_STATUSES.map((status, index) => {
                    const entry = order.statusHistory.find((history) => history.status === status);
                    const stamped = entry ? formatOrderStamp(entry.timestamp) : null;

                    return (
                        <Box key={status}>
                            {index > 0 && <Rule weight='hair' />}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 1.5,
                                    px: 1.5,
                                    color: stamped ? 'text.primary' : 'text.disabled',
                                }}
                            >
                                <Box
                                    aria-hidden
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        flexShrink: 0,
                                        backgroundColor: stamped ? colors.ink : 'transparent',
                                        border: stamped ? 'none' : `1px solid ${colors.inkFaint}`,
                                    }}
                                />
                                <Typography variant='body1' sx={{ flex: 1, fontWeight: stamped ? 500 : 400 }}>
                                    {capitalize(status)}
                                </Typography>
                                <Typography variant='data' sx={{ width: '5.5rem', textAlign: 'right' }}>
                                    {stamped ? stamped.day : '—'}
                                </Typography>
                                <Typography variant='data' sx={{ width: '3.5rem', textAlign: 'right' }}>
                                    {stamped ? stamped.time : '—'}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}

                <PackingList products={order.items} />

                <Rule weight='heavy' sx={{ mt: 4 }} />

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
                    key={isEditFormOpen ? 'open' : 'closed'}
                    isCreateOutgoingOrderFormOpen={isEditFormOpen}
                    closeForm={() => setIsEditFormOpen(false)}
                    orderToEdit={order}
                />
            </Box>
        </Box>
    );
};

export default OutgoingOrderDetails;
