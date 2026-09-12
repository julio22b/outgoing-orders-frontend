import { Box, Button, Typography, capitalize } from '@mui/material';
import { Fragment, useMemo, useState } from 'react';
import BoardColumn from './BoardColumn';
import Rule from '../common/Rule';
import { ORDER_STATUSES } from '../../app/constants';
import { useAppSelector } from '../../app/hooks';
import LoadingOverlay from '../common/LoadingOverlay';
import { colors } from '../../app/theme';
import type { OutgoingOrderInterface } from '../../app/types';

const statusOptions = [ORDER_STATUSES.PICKING, ORDER_STATUSES.PACKED, ORDER_STATUSES.DISPATCHED] as const;

const Board = () => {
    const { orders, loading } = useAppSelector((state) => state.outgoingOrders);
    const { status, priority, date, search } = useAppSelector((state) => state.filters);
    const [statusForMobile, setStatusForMobile] = useState<string>(statusOptions[0]);

    const ordersByStatus = useMemo(() => {
        const normalizedSearch = search.toLocaleLowerCase();
        const filtered = orders.filter((order) => {
            const matchesStatus = status === 'all' || order.status === status;
            const matchesPriority = priority === 'all' || order.priority === priority;
            const matchesSearch =
                !search ||
                order.id?.toString().toLocaleLowerCase().includes(normalizedSearch) ||
                order.customer?.toLocaleLowerCase().includes(normalizedSearch);
            const matchesDate = !date || order.createdAt.slice(0, 10) === date.slice(0, 10);

            return matchesStatus && matchesPriority && matchesSearch && matchesDate;
        });

        return filtered.reduce(
            (acc, order) => {
                (acc[order.status] ??= []).push(order);
                return acc;
            },
            {} as Record<string, OutgoingOrderInterface[]>,
        );
    }, [orders, status, priority, search, date]);

    if (loading) {
        return <LoadingOverlay />;
    }

    const isEmpty = statusOptions.every((option) => (ordersByStatus[option] ?? []).length === 0);

    return (
        <Box sx={{ pt: 3, pb: 6 }}>
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
                <Box sx={{ display: 'flex' }}>
                    {statusOptions.map((option) => {
                        const isActive = statusForMobile === option;
                        return (
                            <Button
                                key={option}
                                variant='text'
                                onClick={() => setStatusForMobile(option)}
                                sx={{
                                    flex: 1,
                                    borderBottom: `2px solid ${isActive ? colors.ink : 'transparent'}`,
                                    color: isActive ? 'text.primary' : 'text.secondary',
                                    typography: 'label',
                                    py: 1,
                                }}
                            >
                                {capitalize(option)} {(ordersByStatus[option] ?? []).length}
                            </Button>
                        );
                    })}
                </Box>
                <Rule weight='hair' sx={{ mt: '-1px' }} />
            </Box>

            {isEmpty ? (
                <Typography variant='body1' sx={{ color: 'text.secondary', py: 4 }}>
                    No orders match these filters.
                </Typography>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'stretch', minHeight: { md: 460 } }}>
                    {statusOptions.map((option, index) => (
                        <Fragment key={option}>
                            {index > 0 && (
                                <Rule vertical weight='hair' sx={{ display: { xs: 'none', md: 'block' }, mx: 3 }} />
                            )}
                            <Box
                                sx={{
                                    display: {
                                        xs: statusForMobile === option ? 'flex' : 'none',
                                        md: 'flex',
                                    },
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <BoardColumn status={option} filteredRows={ordersByStatus[option] ?? []} />
                            </Box>
                        </Fragment>
                    ))}
                </Box>
            )}

            <Rule weight='heavy' sx={{ mt: 3 }} />
        </Box>
    );
};

export default Board;
