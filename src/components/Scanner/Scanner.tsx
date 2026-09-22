import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Field from '../common/Field';
import Rule from '../common/Rule';
import ErrorNotice from '../common/ErrorNotice';
import { controlSx } from '../common/fieldStyles';
import { readFailure, useLazyGetOrderQuery } from '../../api/ordersApi';
import { parseOrderReference } from '../../features/orders/orderFilters';
import { useBarcodeScanner } from '../../features/scanning/useBarcodeScanner';
import { colors, rule } from '../../app/theme';

type ScanOutcome = { kind: 'unreadable'; value: string } | { kind: 'noMatch'; value: string };

interface LookupFailure {
    message: string;
    value: string;
}

const REPEAT_SCAN_COOLDOWN_MS = 2000;

const outcomeDetail = (outcome: ScanOutcome) =>
    outcome.kind === 'unreadable'
        ? "That isn't an order reference. Labels read ORD-1024, or just the number."
        : 'Nothing on the manifest carries that number.';

const Scanner = () => {
    const navigate = useNavigate();
    const [triggerGetOrder] = useLazyGetOrderQuery();
    const [outcome, setOutcome] = useState<ScanOutcome | null>(null);
    const [lookupFailure, setLookupFailure] = useState<LookupFailure | null>(null);
    const [typedValue, setTypedValue] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const lastDetected = useRef<{ value: string; at: number } | null>(null);

    const resolveScan = async (value: string) => {
        const scannedValue = value.trim();
        if (!scannedValue) return;

        setLookupFailure(null);

        const orderId = parseOrderReference(scannedValue);
        if (orderId === null) {
            setOutcome({ kind: 'unreadable', value: scannedValue });
            return;
        }

        const result = await triggerGetOrder(orderId);

        if (result.error) {
            const status = 'status' in result.error ? result.error.status : undefined;
            if (status === 404) {
                setOutcome({ kind: 'noMatch', value: scannedValue });
                return;
            }
            setOutcome(null);
            setLookupFailure({
                message: readFailure(result.error).message ?? "Couldn't look that order up.",
                value: scannedValue,
            });
            return;
        }

        const order = result.data;
        if (!order) return;

        navigate(`/orders/${order.id}`, { replace: true });
    };

    const handleDetected = (value: string) => {
        const now = Date.now();
        const previous = lastDetected.current;
        lastDetected.current = { value, at: now };

        if (previous && previous.value === value && now - previous.at < REPEAT_SCAN_COOLDOWN_MS) {
            return;
        }
        void resolveScan(value);
    };

    const { isSupported, videoRef, cameraError } = useBarcodeScanner(handleDetected);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const submitTypedValue = () => {
        void resolveScan(typedValue);
        setTypedValue('');
        inputRef.current?.focus();
    };

    return (
        <Box sx={{ py: { xs: 3, md: 5 }, maxWidth: '72ch' }}>
            <Typography variant='display' component='h1'>
                Scan a label
            </Typography>
            <Rule weight='heavy' sx={{ mt: 1.5, mb: 3 }} />

            <Field label='Order reference' htmlFor='scan-reference' bordered>
                <TextField
                    id='scan-reference'
                    inputRef={inputRef}
                    value={typedValue}
                    onChange={(e) => setTypedValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            submitTypedValue();
                        }
                    }}
                    placeholder='ORD-1024'
                    autoComplete='off'
                    fullWidth
                    sx={controlSx}
                />
            </Field>

            {isSupported ? (
                <Box
                    sx={{
                        mt: 3,
                        border: rule.mid,
                        backgroundColor: colors.ink,
                        '& video': { width: '100%', maxHeight: 360, objectFit: 'cover', display: 'block' },
                    }}
                >
                    <video ref={videoRef} autoPlay playsInline muted />
                </Box>
            ) : (
                <Typography variant='data' component='p' sx={{ mt: 3, color: colors.inkMuted }}>
                    Camera scanning needs Chrome, Edge or Android. Everything else goes through the field above.
                </Typography>
            )}

            {cameraError && (
                <Typography variant='data' component='p' sx={{ mt: 1.5, color: colors.stamp }}>
                    {cameraError}
                </Typography>
            )}

            {lookupFailure && (
                <ErrorNotice
                    message={lookupFailure.message}
                    onRetry={() => void resolveScan(lookupFailure.value)}
                    sx={{ mt: 3 }}
                />
            )}

            {outcome && (
                <Box sx={{ mt: 3 }}>
                    <Rule weight='mid' />
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            border: rule.hair,
                            backgroundColor: colors.stampWash,
                        }}
                    >
                        <Typography variant='data' component='p' sx={{ wordBreak: 'break-all' }}>
                            {outcome.value}
                        </Typography>
                        <Typography variant='body2' sx={{ mt: 0.75, color: 'text.secondary' }}>
                            {outcomeDetail(outcome)}
                        </Typography>
                    </Box>
                </Box>
            )}

            <Button variant='outlined' onClick={() => navigate('/')} sx={{ mt: 3 }}>
                Back to the board
            </Button>
        </Box>
    );
};

export default Scanner;
