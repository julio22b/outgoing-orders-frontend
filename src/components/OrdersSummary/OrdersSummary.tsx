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
        <Box sx={{ display: 'flex', gap: '1em', alignItems: 'center', margin: '2em 2em 0 2em', '& > *': { flex: 1 } }}>
            <OrderCard title='TOTAL TODAY' amount={rows.length} />
            <OrderCard
                title={ORDER_STATUSES.PICKING.toLocaleUpperCase()}
                amount={amounts[ORDER_STATUSES.PICKING] || 0}
            />
            <OrderCard title={ORDER_STATUSES.PACKED.toLocaleUpperCase()} amount={amounts[ORDER_STATUSES.PACKED] || 0} />
            <OrderCard
                title={ORDER_STATUSES.DELAYED.toLocaleUpperCase()}
                amount={amounts[ORDER_STATUSES.DELAYED] || 0}
            />
        </Box>
    );
};

export default OrdersSummary;
