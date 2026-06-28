import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { formatOrderDate } from '../../app/utils';
import CustomChip from './CustomChip';
import type { OutgoingOrderInterface } from '../../app/types';
import { useNavigate } from 'react-router-dom';

interface KanbanCardProps {
    order: OutgoingOrderInterface;
}

const KanbanCard = ({ order }: KanbanCardProps) => {
    const navigate = useNavigate();

    return (
        <Card variant='outlined'>
            <CardActionArea onClick={() => navigate(`/orders/${order.id}`, { state: { orderId: order.id } })}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>{`ORD-${order.id}`}</Typography>
                        <CustomChip title={order.priority} />
                    </Box>
                    <Typography sx={{ margin: '1em 0' }}>{order.customer}</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <Typography variant='subtitle2'>{order.items.length} items</Typography>
                        <Typography variant='subtitle2'>{formatOrderDate(order.createdAt)}</Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default KanbanCard;
