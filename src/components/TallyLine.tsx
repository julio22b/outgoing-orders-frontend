import { Box, Typography, capitalize } from '@mui/material';
import ErrorNotice from './common/ErrorNotice';
import { VISIBLE_ORDER_STATUSES } from '../app/constants';
import { statusColor } from '../app/theme';
import { useGetOrdersSummaryQuery } from '../api/ordersApi';

const TallyLine = () => {
    const { data: summary, isError, refetch } = useGetOrdersSummaryQuery({});

    const visibleTotal = summary && VISIBLE_ORDER_STATUSES.reduce((sum, status) => sum + summary.byStatus[status], 0);

    const tallies = [
        { label: 'Total', count: visibleTotal, status: null },
        ...VISIBLE_ORDER_STATUSES.map((status) => ({
            label: capitalize(status),
            count: summary?.byStatus[status],
            status,
        })),
    ];

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 4, sm: 7 }, pt: 3, pb: 2.5 }}>
            {tallies.map(({ label, count, status }) => (
                <Box key={label}>
                    <Typography
                        variant='tally'
                        component='p'
                        sx={{ color: status ? statusColor(status).ink : 'text.primary' }}
                    >
                        {count?.toLocaleString() ?? '—'}
                    </Typography>
                    <Typography variant='label' sx={{ display: 'block', color: 'text.secondary', mt: 1 }}>
                        {label}
                    </Typography>
                </Box>
            ))}
            {isError && (
                <ErrorNotice message="Couldn't load totals." onRetry={() => refetch()} sx={{ alignSelf: 'center' }} />
            )}
        </Box>
    );
};

export default TallyLine;
