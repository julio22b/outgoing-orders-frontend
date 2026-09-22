import { Box, Button, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OutgoingOrdersForm from './OutgoingOrdersForm/OutgoingOrdersForm';
import { useAppSelector } from '../app/hooks';
import { colors } from '../app/theme';

const clockFormat = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
});

const onInkButtonSx = {
    borderColor: colors.onInk,
    color: colors.onInk,
    '&:hover': { borderColor: colors.onInk, backgroundColor: colors.onInk, color: colors.ink },
    '&.Mui-focusVisible': { outline: `2px solid ${colors.onInk}` },
};

const Letterhead = () => {
    const [isCreateOutgoingOrderFormOpen, setIsCreateOutgoingOrderFormOpen] = useState(false);
    const lastEventAt = useAppSelector((state) => state.outgoingOrders.lastEventAt);
    const [isFlashing, setIsFlashing] = useState(false);
    const seenEventAt = useRef<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (lastEventAt === null) return;

        // avoids flashing the initial value
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
                                color: isFlashing ? colors.stampOnInk : colors.onInkMuted,
                                transition: 'color 120ms linear',
                            }}
                        >
                            Updated {clockFormat.format(lastEventAt)}
                        </Typography>
                    )}
                    <Button variant='outlined' onClick={() => navigate('/scan')} sx={onInkButtonSx}>
                        Scan
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={() => setIsCreateOutgoingOrderFormOpen(true)}
                        sx={onInkButtonSx}
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
