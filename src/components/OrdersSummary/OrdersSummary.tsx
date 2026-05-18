import { Box } from '@mui/material';
import OrderCard from './OrderCard';

const OrdersSummary = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, border: '1px solid red' }}>
            <OrderCard title='Total today' amount={123} />
            <OrderCard title='Picking' amount={123} />
            <OrderCard title='Packed' amount={123} />
            <OrderCard title='Delayed' amount={123} />
        </Box>
    );
};

export default OrdersSummary;
