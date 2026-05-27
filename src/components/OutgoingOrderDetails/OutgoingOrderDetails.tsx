import { useLocation, useNavigate } from 'react-router-dom';
import type { OutgoingOrderInterface } from '../../app/types';
import { Box, Button, capitalize, Card, CardContent, Divider, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomChip from '../DataGrid/CustomChip';
import { formatOrderDate } from '../../app/utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import theme from '../../app/theme';
import { useAppDispatch } from '../../app/hooks';
import { removeOutgoingOrder } from '../../features/slices/outgoingOrdersSlice';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog.tsx/DeleteConfirmationDialog';
import { useState } from 'react';

const OutgoingOrderDetails = () => {
    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState(false);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order as OutgoingOrderInterface | null;
    if (!order) {
        return <div>No order found</div>;
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
            <Box sx={{ marginTop: '3em', display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant='h5'>{order.id}</Typography>
                    <Typography variant='subtitle1'>{order.customer}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                    <Button variant='outlined' color='secondary' startIcon={<EditIcon />}>
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
                        {order.products.length}
                    </CardContent>
                </Card>
            </Box>
            <Card variant='outlined'>
                <CardContent>
                    <Typography gutterBottom variant='h6'>
                        Status timeline
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '1em', '& > *': { flex: 1 } }}>
                        {['picking', 'packed', 'dispatched'].map((status, index) => {
                            const statusesOrder: Record<string, number> = {
                                picking: 1,
                                packed: 2,
                                dispatched: 3,
                                delayed: 4,
                            };
                            const currentStatusHistory = order.statusHistory.find(
                                (orderStatus) => orderStatus.status === status,
                            )!;

                            const isDone = statusesOrder[status] <= statusesOrder[currentStatusHistory?.status] || 0;
                            const color = isDone ? theme.palette.success.main : theme.palette.warning.main;
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
                                        <CheckCircleIcon
                                            fontSize='large'
                                            sx={{
                                                border: `1px solid ${theme.palette.secondary.main}`,
                                                borderRadius: '50%',
                                                color,
                                            }}
                                        />
                                        <Typography color={color}>{capitalize(status)}</Typography>
                                        <Typography variant='subtitle2'>
                                            {currentStatusHistory
                                                ? formatOrderDate(currentStatusHistory.timestamp)
                                                : 'N/A'}
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
                </CardContent>
            </Card>
            <DeleteConfirmationDialog
                closeDialog={() => setIsDeleteOrderDialogOpen(false)}
                isOpen={isDeleteOrderDialogOpen}
                onDelete={() => {
                    dispatch(removeOutgoingOrder(order.id))
                    navigate('/');
                }}
                selectedOrder={order}
            />
        </Box>
    );
};

export default OutgoingOrderDetails;
