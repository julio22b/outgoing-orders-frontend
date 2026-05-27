import { useLocation } from 'react-router-dom';
import type { OutgoingOrderInterface } from '../../app/types';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomChip from '../DataGrid/CustomChip';
import { formatOrderDate } from '../../app/utils';

const OutgoingOrderDetails = () => {
    const location = useLocation();
    const order = location.state?.order as OutgoingOrderInterface | null;
    if (!order) {
        return <div>No order found</div>;
    }
    console.log(order);
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
                    <Button variant='outlined' color='warning' startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: '1em', '& > *': { flex: 1 } }}>
                <Card>
                    <CardContent>
                        <Typography variant='h6'>Status</Typography>
                        <CustomChip title={order.status} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant='h6'>Priority</Typography>
                        <CustomChip title={order.priority} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant='h6'>Date</Typography>
                        {formatOrderDate(order.createdAt)}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant='h6'>Items</Typography>
                        {order.products.length}
                    </CardContent>
                </Card>
            </Box>
            <Box>
                <Typography variant='h6'>Status timeline</Typography>
                <Box>
                    {order.statusHistory.map((status, index) => (
                        <Box>heck</Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default OutgoingOrderDetails;
