import { Box } from '@mui/material';
import OrderCard from './OrderCard';
import { ORDER_STATUSES } from '../../app/constants';
import { useAppSelector } from '../../app/hooks';

const OrdersSummary = () => {
    const rows = useAppSelector((state) => state.outgoingOrders.orders);
    const amounts = rows.reduce((acc: Record<string, number>, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <Box
            sx={{
                display: 'flex',
                gap: '1em',
                alignItems: 'center',
                margin: '2em 2em 0 2em',
                '& > *': { flex: 1, minWidth: '150px' },
                flexWrap: 'wrap',
            }}
        >
            <OrderCard title='Total today' amount={rows.length} />
            <OrderCard title={ORDER_STATUSES.PICKING} amount={amounts[ORDER_STATUSES.PICKING]} />
            <OrderCard title={ORDER_STATUSES.PACKED} amount={amounts[ORDER_STATUSES.PACKED]} />
            <OrderCard title={ORDER_STATUSES.DISPATCHED} amount={amounts[ORDER_STATUSES.DISPATCHED]} />
        </Box>
    );
};

export default OrdersSummary;
