import { Box, Button, ButtonGroup, capitalize } from '@mui/material';
import KanbanColumn from './KanbanColumn';
import { ORDER_STATUSES } from '../../app/constants';
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import LoadingOverlay from '../common/LoadingOverlay';
import type { OutgoingOrderInterface } from '../../app/types';

const statusOptions = [ORDER_STATUSES.PICKING, ORDER_STATUSES.PACKED, ORDER_STATUSES.DISPATCHED] as const;

const KanbanBoard = () => {
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

    return (
        <Box sx={{ margin: '2em', width: 'calc(100% - 4em)' }}>
            <ButtonGroup sx={{ display: { xs: 'flex', md: 'none' }, mb: '1em' }} fullWidth>
                {statusOptions.map((option) => (
                    <Button
                        key={option}
                        variant={statusForMobile === option ? 'contained' : 'outlined'}
                        onClick={() => setStatusForMobile(option)}
                    >
                        {capitalize(option)}
                    </Button>
                ))}
            </ButtonGroup>
            <Box
                sx={{
                    display: 'flex',
                    gap: '1em',
                    alignItems: 'stretch',
                    '& > *': { flex: 1, minWidth: '150px' },
                }}
            >
                {statusOptions.map((status) => (
                    <Box
                        key={status}
                        sx={{
                            display: { xs: statusForMobile === status ? 'flex' : 'none', md: 'flex' },
                            flexDirection: 'column',
                            flex: 1,
                        }}
                    >
                        <KanbanColumn status={status} filteredRows={ordersByStatus[status] ?? []} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default KanbanBoard;
