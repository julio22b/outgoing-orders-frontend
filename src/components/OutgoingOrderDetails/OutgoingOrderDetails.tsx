import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, capitalize } from '@mui/material';
import { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleIcon from '@mui/icons-material/Circle';
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
import { HIDDEN_ORDER_STATUSES, ORDER_PRIORITIES, STATUS_TRANSITIONS, TIMELINE_STATUSES } from '../../app/constants';
import { colors, rule, statusColor } from '../../app/theme';

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
    const nextStatus = order && STATUS_TRANSITIONS[order.status];

    useEffect(() => {
        if (id) dispatch(fetchOrder(id));
    }, [dispatch, id]);

    if (detailsLoading && !order) {
        return <LoadingOverlay message='Loading order' />;
    }

    if (!order || HIDDEN_ORDER_STATUSES.includes(order.status)) {
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
    const stages = TIMELINE_STATUSES.map((status) => {
        const entry = order.statusHistory.find((history) => history.status === status);
        return {
            status,
            done: Boolean(entry),
            color: statusColor(status).ink,
            stamped: entry ? formatOrderStamp(entry.timestamp) : null,
        };
    });
    const isHighPriority = order.priority === ORDER_PRIORITIES.HIGH;
    // Only stamp down when the change arrived from another client while watching.
    const justChangedStatus = recentChanges[order.id]?.statusChanged ?? false;

    return (
        <Box sx={{ position: 'relative' }}>
            {detailsLoading && <LoadingOverlay absolute />}
            <Box sx={{ pb: 8 }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { sm: 1 } }}>
                            {isHighPriority && <Stamp label='Rush' color={colors.stamp} filled />}
                            <Stamp
                                label={order.status}
                                color={statusColor(order.status).ink}
                                size='lg'
                                animate={justChangedStatus}
                            />
                        </Box>
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

                {/* Status is deliberately absent — the stamp above already says it. */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                        border: rule.mid,
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

                {/*
                    The original stepper, restored. The pattern was always right for
                    a fixed three-stage pipeline; only the stock styling read as
                    generic. Each completed stage takes its status colour, matching
                    the tally, and a stage's outgoing line fills once it's done.
                */}
                <Box
                    component='ol'
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        listStyle: 'none',
                        m: 0,
                        p: 0,
                        pt: 4,
                        pb: 1,
                    }}
                >
                    {stages.map(({ status, done, color, stamped }, index) => {
                        const incoming = index > 0 ? stages[index - 1] : null;
                        const leftLine = incoming ? (incoming.done ? incoming.color : colors.ruleHair) : 'transparent';
                        const rightLine = index < stages.length - 1 ? (done ? color : colors.ruleHair) : 'transparent';
                        const nodeColor = done ? color : colors.ruleHair;
                        const iconSx = {
                            border: `3px solid ${done ? color : colors.ruleMid}`,
                            borderRadius: '50%',
                            color: nodeColor,
                            flexShrink: 0,
                        };

                        return (
                            <Box
                                component='li'
                                key={status}
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} aria-hidden>
                                    <Box sx={{ flex: 1, height: 4, backgroundColor: leftLine }} />
                                    {done ? (
                                        <CheckCircleIcon fontSize='large' sx={iconSx} />
                                    ) : (
                                        <CircleIcon fontSize='large' sx={iconSx} />
                                    )}
                                    {/* Overlap the next column by 1px: two halves meeting at a
                                        fractional pixel boundary left a visible seam, and both
                                        halves of a connector share a colour so the overlap is
                                        invisible. */}
                                    <Box
                                        sx={{
                                            flex: 1,
                                            height: 4,
                                            backgroundColor: rightLine,
                                            mr: index < stages.length - 1 ? '-1px' : 0,
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant='body1'
                                    sx={{
                                        color: done ? 'text.primary' : 'text.secondary',
                                        fontWeight: done ? 600 : 400,
                                        textAlign: 'center',
                                    }}
                                >
                                    {capitalize(status)}
                                </Typography>
                                <Typography variant='data' sx={{ color: 'text.secondary', textAlign: 'center' }}>
                                    {stamped ? `${stamped.day} ${stamped.time}` : '—'}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>

                <PackingList products={order.items} />

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
