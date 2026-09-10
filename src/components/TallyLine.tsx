import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { ORDER_STATUSES } from '../app/constants';
import { useAppSelector } from '../app/hooks';
import Rule from './common/Rule';

/**
 * The day's tally.
 *
 * This replaces a row of four KPI cards — each with a decorative colored bar and
 * a hover lift it couldn't act on — with one line of the sheet. The numbers are
 * the same; they just stop pretending to be objects.
 */
const TallyLine = () => {
    const orders = useAppSelector((state) => state.outgoingOrders.orders);

    const tallies = useMemo(() => {
        const byStatus = orders.reduce((acc: Record<string, number>, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        return [
            { label: 'Total', count: orders.length },
            { label: 'Picking', count: byStatus[ORDER_STATUSES.PICKING] ?? 0 },
            { label: 'Packed', count: byStatus[ORDER_STATUSES.PACKED] ?? 0 },
            { label: 'Dispatched', count: byStatus[ORDER_STATUSES.DISPATCHED] ?? 0 },
        ];
    }, [orders]);

    return (
        <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2.5, sm: 5 }, pb: 1.75 }}>
                {tallies.map(({ label, count }) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant='label' sx={{ color: 'text.secondary' }}>
                            {label}
                        </Typography>
                        <Typography variant='figure'>{count}</Typography>
                    </Box>
                ))}
            </Box>
            <Rule weight='heavy' />
        </Box>
    );
};

export default TallyLine;
