import { Box, Button, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import OutgoingOrdersForm from './OutgoingOrdersForm/OutgoingOrdersForm';
import Rule from './common/Rule';
import Sheet from './common/Sheet';
import { useAppSelector } from '../app/hooks';
import { colors } from '../app/theme';

const clockFormat = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
});

/**
 * The top of the sheet.
 *
 * The old header carried a green dot pulsing on a 2.5s loop whether or not
 * anything had happened. This shows the time of the last real change instead and
 * flashes only when one arrives, so motion always means something occurred.
 */
const Letterhead = () => {
    const [isCreateOutgoingOrderFormOpen, setIsCreateOutgoingOrderFormOpen] = useState(false);
    const lastEventAt = useAppSelector((state) => state.outgoingOrders.lastEventAt);
    const [isFlashing, setIsFlashing] = useState(false);
    const seenEventAt = useRef<number | null>(null);

    useEffect(() => {
        if (lastEventAt === null) return;
        // Don't flash for the value we were seeded with on first load.
        if (seenEventAt.current === null) {
            seenEventAt.current = lastEventAt;
            return;
        }
        if (seenEventAt.current === lastEventAt) return;

        seenEventAt.current = lastEventAt;
        setIsFlashing(true);
        const timer = window.setTimeout(() => setIsFlashing(false), 600);
        return () => window.clearTimeout(timer);
    }, [lastEventAt]);

    return (
        <Box component='header'>
            <Sheet sx={{ pt: 2 }}>
                <Rule weight='heavy' />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'baseline' },
                        justifyContent: 'space-between',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1.5, sm: 3 },
                        py: 2,
                    }}
                >
                    <Typography variant='display' component='h1'>
                        Outgoing Orders
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2.5, flexShrink: 0 }}>
                        {lastEventAt !== null && (
                            <Typography
                                variant='data'
                                sx={{
                                    color: isFlashing ? colors.stamp : 'text.secondary',
                                    transition: 'color 120ms linear',
                                }}
                            >
                                Updated {clockFormat.format(lastEventAt)}
                            </Typography>
                        )}
                        <Button variant='outlined' onClick={() => setIsCreateOutgoingOrderFormOpen(true)}>
                            New order
                        </Button>
                    </Box>
                </Box>
            </Sheet>

            <OutgoingOrdersForm
                key={isCreateOutgoingOrderFormOpen ? 'open' : 'closed'}
                isCreateOutgoingOrderFormOpen={isCreateOutgoingOrderFormOpen}
                closeForm={() => setIsCreateOutgoingOrderFormOpen(false)}
                orderToEdit={null}
            />
        </Box>
    );
};

export default Letterhead;
