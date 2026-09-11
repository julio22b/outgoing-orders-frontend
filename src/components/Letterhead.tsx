import { Box, Button, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import OutgoingOrdersForm from './OutgoingOrdersForm/OutgoingOrdersForm';
import { useAppSelector } from '../app/hooks';
import { colors } from '../app/theme';

const clockFormat = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
});

/**
 * The top of the sheet, printed as a solid band of ink.
 *
 * The page was previously all pale surfaces and thin dark lines, with no mass
 * anywhere to hold the composition down. Reversing the masthead out of ink
 * gives it an anchor, and reads like a shipping label.
 *
 * The original header carried a green dot pulsing on a 2.5s loop whether or not
 * anything had happened. This shows the time of the last real change instead
 * and flashes only when one arrives, so motion always means something occurred.
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
            <Box
                sx={{
                    backgroundColor: colors.ink,
                    color: colors.onInk,
                    // Bleed past the sheet's padding so the band meets its edges.
                    mx: { xs: -2, sm: -3, md: -5 },
                    px: { xs: 2, sm: 3, md: 5 },
                    py: 2.5,
                    display: 'flex',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 3 },
                }}
            >
                <Typography variant='masthead' component='h1'>
                    Outgoing Orders
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexShrink: 0 }}>
                    {lastEventAt !== null && (
                        <Typography
                            variant='data'
                            sx={{
                                // The dark red would vanish against ink, so the same
                                // signal is carried by a lighter tint inside the band.
                                color: isFlashing ? colors.stampOnInk : colors.onInkMuted,
                                transition: 'color 120ms linear',
                            }}
                        >
                            Updated {clockFormat.format(lastEventAt)}
                        </Typography>
                    )}
                    <Button
                        variant='outlined'
                        onClick={() => setIsCreateOutgoingOrderFormOpen(true)}
                        sx={{
                            borderColor: colors.onInk,
                            color: colors.onInk,
                            '&:hover': {
                                borderColor: colors.onInk,
                                backgroundColor: colors.onInk,
                                color: colors.ink,
                            },
                            // The global focus ring is ink, which is invisible
                            // against the band. Reverse it here too.
                            '&.Mui-focusVisible': { outline: `2px solid ${colors.onInk}` },
                        }}
                    >
                        New order
                    </Button>
                </Box>
            </Box>

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
