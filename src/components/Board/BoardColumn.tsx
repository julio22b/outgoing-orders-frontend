import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import BoardEntry from './BoardEntry';
import Rule from '../common/Rule';
import Stamp from '../common/Stamp';
import type { OutgoingOrderInterface } from '../../app/types';

const PAGE_SIZE = 5;

interface BoardColumnProps {
    status: 'picking' | 'packed' | 'dispatched';
    filteredRows: OutgoingOrderInterface[];
}

const BoardColumn = ({ status, filteredRows }: BoardColumnProps) => {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // slice() clamps on its own, so a narrowing filter needs no reset — and an
    // operator who expanded the column keeps that choice when they clear it.
    const visibleOrders = filteredRows.slice(0, visibleCount);
    const remaining = filteredRows.length - visibleOrders.length;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            {/* On mobile the tab bar already names the visible column and gives
                its count, so repeating both here just doubles the header. */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 2,
                    px: 1.5,
                    pb: 1,
                }}
            >
                {/* The stamp belongs on the screen people actually live in. A
                    column's identity is exactly what a stamp is for. */}
                <Stamp label={status} component='h2' />
                <Typography variant='figure' sx={{ color: 'text.secondary' }}>
                    {filteredRows.length}
                </Typography>
            </Box>
            <Rule weight='mid' sx={{ display: { xs: 'none', md: 'block' } }} />

            {filteredRows.length === 0 ? (
                <Typography variant='data' sx={{ color: 'text.disabled', px: 1.5, py: 2.5 }}>
                    Nothing {status}
                </Typography>
            ) : (
                visibleOrders.map((order, index) => (
                    <Box key={order.id}>
                        {index > 0 && <Rule weight='hair' />}
                        <BoardEntry order={order} />
                    </Box>
                ))
            )}

            {remaining > 0 && (
                <>
                    <Rule weight='hair' />
                    <Box sx={{ px: 0.5, pt: 0.5 }}>
                        <Button
                            variant='text'
                            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                            sx={{ typography: 'data', minHeight: 30, px: 1 }}
                        >
                            Show {Math.min(remaining, PAGE_SIZE)} more
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default BoardColumn;
