import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatOrderStamp, pluralize } from '../../app/utils';
import { ORDER_PRIORITIES } from '../../app/constants';
import { useAppSelector } from '../../app/hooks';
import { colors } from '../../app/theme';
import Stamp from '../common/Stamp';
import type { OutgoingOrderInterface } from '../../app/types';

interface BoardEntryProps {
    order: OutgoingOrderInterface;
}

const BoardEntry = ({ order }: BoardEntryProps) => {
    const navigate = useNavigate();
    const recentChange = useAppSelector((state) => state.outgoingOrders.recentChanges[order.id]);
    const isPending = useAppSelector((state) => order.id in state.outgoingOrders.pendingWrites);
    const { day, time } = formatOrderStamp(order.createdAt);

    const isHigh = order.priority === ORDER_PRIORITIES.HIGH;
    const isLow = order.priority === ORDER_PRIORITIES.LOW;

    return (
        <Box
            component='button'
            onClick={() => navigate(`/orders/${order.id}`)}
            sx={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                font: 'inherit',
                color: 'inherit',
                border: 'none',
                borderRadius: 0,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                px: 0,
                py: 1.5,
                opacity: isPending ? 0.5 : 1,
                transition: 'background-color 90ms linear, opacity 90ms linear',
                '&:hover': { backgroundColor: colors.hoverWash },
                ...(recentChange && { animation: 'markFade 2500ms ease-out both' }),
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    minHeight: 25,
                }}
            >
                <Typography variant='entry' sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                    {order.customer}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                    {isHigh && <Stamp label='Rush' color={colors.stamp} filled />}
                    <Typography variant='data' sx={{ color: 'text.secondary' }}>
                        ORD-{order.id}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    mt: 0.75,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, minWidth: 0 }}>
                    {isLow && (
                        <Typography variant='label' sx={{ color: colors.inkFaint, flexShrink: 0 }}>
                            Low
                        </Typography>
                    )}
                    <Typography variant='data' sx={{ color: 'text.secondary' }}>
                        {pluralize(order.items.length, 'item')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
                    <Typography variant='data' sx={{ color: 'text.secondary' }}>
                        {day}
                    </Typography>
                    <Typography variant='data' sx={{ color: 'text.secondary' }}>
                        {time}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default BoardEntry;
