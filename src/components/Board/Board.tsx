import { Box, Button, Typography, capitalize } from '@mui/material';
import { Fragment, useState } from 'react';
import BoardColumn from './BoardColumn';
import Rule from '../common/Rule';
import { ALL_FILTER, ORDER_STATUSES } from '../../app/constants';
import { colors } from '../../app/theme';
import { useGetOrdersSummaryQuery } from '../../api/ordersApi';
import { useOrderFilterArgs } from '../../features/orders/useOrderFilterArgs';

const statusOptions = [ORDER_STATUSES.PICKING, ORDER_STATUSES.PACKED, ORDER_STATUSES.DISPATCHED] as const;

type BoardStatus = (typeof statusOptions)[number];

const Board = () => {
    const { statusFilter, filterArgs } = useOrderFilterArgs();
    const { data: summary } = useGetOrdersSummaryQuery(filterArgs);
    const [statusForMobile, setStatusForMobile] = useState<BoardStatus>(statusOptions[0]);

    const isColumnShown = (status: BoardStatus) => statusFilter === ALL_FILTER || statusFilter === status;
    const tallyFor = (status: BoardStatus) => (isColumnShown(status) ? summary?.byStatus[status] : 0);
    const isEmpty = summary !== undefined && statusOptions.every((status) => (tallyFor(status) ?? 0) === 0);

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
                                {capitalize(option)} {tallyFor(option)?.toLocaleString() ?? '—'}
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
                                <BoardColumn
                                    status={option}
                                    listArgs={{ ...filterArgs, status: option }}
                                    isShown={isColumnShown(option)}
                                    orderCount={summary?.byStatus[option]}
                                />
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
