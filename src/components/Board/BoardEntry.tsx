import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatOrderStamp, pluralize } from '../../app/utils';
import { ORDER_PRIORITIES } from '../../app/constants';
import { useAppSelector } from '../../app/hooks';
import { colors } from '../../app/theme';
import type { OutgoingOrderInterface } from '../../app/types';

interface BoardEntryProps {
    order: OutgoingOrderInterface;
}

/**
 * A line on the manifest.
 *
 * No border, no fill, no radius — an entry is separated from its neighbours by a
 * rule, the way rows on a form are. Status isn't shown: the column already says
 * it, and repeating it on every line is what made the old cards so noisy.
 */
const BoardEntry = ({ order }: BoardEntryProps) => {
    const navigate = useNavigate();
    const recentChange = useAppSelector((state) => state.outgoingOrders.recentChanges[order.id]);
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
                // A high-priority line is flagged in the margin, the way someone
                // would mark up a printed sheet. It is the only color on the board.
                borderLeft: `3px solid ${isHigh ? colors.stamp : 'transparent'}`,
                // A raw <button> keeps the UA's radius; CssBaseline doesn't reset it.
                borderRadius: 0,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                px: 1.5,
                py: 1.5,
                transition: 'background-color 90ms linear',
                '&:hover': { backgroundColor: colors.hoverWash },
                ...(recentChange && { animation: 'markFade 2500ms ease-out both' }),
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1.5 }}>
                <Typography variant='entry' sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                    {order.customer}
                </Typography>
                <Typography variant='data' sx={{ color: 'text.secondary', flexShrink: 0 }}>
                    ORD-{order.id}
                </Typography>
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
                    {isHigh && (
                        <Typography variant='label' sx={{ color: colors.stamp, flexShrink: 0 }}>
                            High
                        </Typography>
                    )}
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
