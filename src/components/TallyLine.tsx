import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { ORDER_STATUSES } from '../app/constants';
import { useAppSelector } from '../app/hooks';
import { statusColor } from '../app/theme';
import Rule from './common/Rule';

/**
 * The day's tally, and the first thing on the sheet meant to be read.
 *
 * The counts were previously set inline after a tiny label, which read as a
 * ragged strip rather than a figure to land on. Each count now sits above its
 * own label at the top of the type scale, in the colour of the status it
 * counts, so the eye has somewhere obvious to start.
 */
const TallyLine = () => {
    const orders = useAppSelector((state) => state.outgoingOrders.orders);

    const tallies = useMemo(() => {
        const byStatus = orders.reduce((acc: Record<string, number>, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        return [
            { label: 'Total', count: orders.length, status: null },
            { label: 'Picking', count: byStatus[ORDER_STATUSES.PICKING] ?? 0, status: ORDER_STATUSES.PICKING },
            { label: 'Packed', count: byStatus[ORDER_STATUSES.PACKED] ?? 0, status: ORDER_STATUSES.PACKED },
            {
                label: 'Dispatched',
                count: byStatus[ORDER_STATUSES.DISPATCHED] ?? 0,
                status: ORDER_STATUSES.DISPATCHED,
            },
        ];
    }, [orders]);

    return (
        <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 4, sm: 7 }, pt: 3, pb: 2.5 }}>
                {tallies.map(({ label, count, status }) => (
                    <Box key={label}>
                        <Typography
                            variant='tally'
                            component='p'
                            sx={{ color: status ? statusColor(status).ink : 'text.primary' }}
                        >
                            {count}
                        </Typography>
                        <Typography variant='label' sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
                            {label}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Rule weight='heavy' />
        </Box>
    );
};

export default TallyLine;
