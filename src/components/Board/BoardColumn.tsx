import { Box, Button, Typography } from '@mui/material';
import { useMemo } from 'react';
import BoardEntry from './BoardEntry';
import Rule from '../common/Rule';
import Stamp from '../common/Stamp';
import ErrorNotice from '../common/ErrorNotice';
import { PAGE_SIZE } from '../../app/constants';
import { statusColor } from '../../app/theme';
import { useListOrdersInfiniteQuery } from '../../api/ordersApi';
import type { ListOrdersArgs } from '../../app/types';

interface BoardColumnProps {
    status: 'picking' | 'packed' | 'dispatched';
    listArgs: ListOrdersArgs;
    isShown: boolean;
    orderCount: number | undefined;
}

const BoardColumn = ({ status, listArgs, isShown, orderCount }: BoardColumnProps) => {
    const { ink, tint } = statusColor(status);
    const { data, isLoading, isFetching, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } =
        useListOrdersInfiniteQuery(listArgs, { skip: !isShown });

    const loadedOrders = useMemo(
        () => (isShown ? (data?.pages.flatMap((page) => page.data) ?? []) : []),
        [data, isShown],
    );
    const isRefreshing = isFetching && !isFetchingNextPage && !isLoading;
    const displayCount = isShown ? orderCount : 0;
    const unloadedCount = displayCount === undefined ? 0 : displayCount - loadedOrders.length;
    const showMoreLabel = unloadedCount > 0 ? `Show ${Math.min(unloadedCount, PAGE_SIZE)} more` : 'Show more';
    const hasLoadedOrders = loadedOrders.length > 0;

    const errorNotice = <ErrorNotice message={`Couldn't load ${status}.`} onRetry={() => refetch()} sx={{ py: 2 }} />;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
                backgroundColor: tint,
                px: 1.5,
                pt: 1.5,
                pb: 1,
            }}
        >
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 2,
                    pb: 1,
                }}
            >
                <Stamp label={status} color={ink} component='h2' />
                <Typography variant='figure' sx={{ color: 'text.secondary' }}>
                    {displayCount?.toLocaleString() ?? '—'}
                </Typography>
            </Box>
            <Rule weight='mid' sx={{ display: { xs: 'none', md: 'block' } }} />

            {isShown && isLoading ? (
                <Typography variant='data' sx={{ color: 'text.disabled', py: 2.5 }}>
                    Loading {status}…
                </Typography>
            ) : hasLoadedOrders ? (
                <Box sx={{ opacity: isRefreshing ? 0.5 : 1, transition: 'opacity 120ms linear' }}>
                    {loadedOrders.map((order, index) => (
                        <Box key={order.id}>
                            {index > 0 && <Rule weight='hair' />}
                            <BoardEntry order={order} />
                        </Box>
                    ))}
                </Box>
            ) : isError ? (
                errorNotice
            ) : (
                <Typography variant='data' sx={{ color: 'text.disabled', py: 2.5 }}>
                    Nothing {status}
                </Typography>
            )}

            {isError && hasLoadedOrders && (
                <>
                    <Rule weight='hair' />
                    {errorNotice}
                </>
            )}

            {hasNextPage && !isError && (
                <>
                    <Rule weight='hair' />
                    <Box sx={{ px: 0.5, pt: 0.5 }}>
                        <Button
                            variant='text'
                            disabled={isFetchingNextPage}
                            onClick={() => fetchNextPage()}
                            sx={{ typography: 'data', minHeight: 30, px: 1 }}
                        >
                            {isFetchingNextPage ? 'Loading…' : showMoreLabel}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default BoardColumn;
