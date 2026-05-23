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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OrderCard title='TOTAL TODAY' amount={rows.length} />
            <OrderCard title={ORDER_STATUSES.PICKING.toLocaleUpperCase()} amount={amounts['picking'] || 0} />
            <OrderCard title={ORDER_STATUSES.PACKED.toLocaleUpperCase()} amount={amounts['packed'] || 0} />
            <OrderCard title={ORDER_STATUSES.DELAYED.toLocaleUpperCase()} amount={amounts['delayed'] || 0} />
        </Box>
    );
};

export default OrdersSummary;
