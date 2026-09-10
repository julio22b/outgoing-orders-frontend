import { Box, Typography } from '@mui/material';
import { colors } from '../../app/theme';

interface LoadingOverlayProps {
    message?: string;
    subMessage?: string;
    absolute?: boolean;
}

/**
 * A sheet still being filled in.
 *
 * No spinner: a blinking caret says "waiting on the machine" in the same
 * vocabulary as the rest of the app, and costs nothing to render.
 */
const LoadingOverlay = ({ message = 'Loading orders', subMessage, absolute }: LoadingOverlayProps) => (
    <Box
        role='status'
        aria-live='polite'
        sx={{
            position: absolute ? 'absolute' : 'fixed',
            inset: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: colors.paper,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
        }}
    >
        <Box sx={{ maxWidth: '44ch' }}>
            <Typography variant='data' component='p' sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                {message}
                <Box
                    component='span'
                    aria-hidden
                    sx={{
                        display: 'inline-block',
                        width: '0.5em',
                        height: '1em',
                        backgroundColor: colors.ink,
                        transform: 'translateY(0.1em)',
                        animation: 'caret 1100ms steps(1, end) infinite',
                    }}
                />
            </Typography>
            {subMessage && (
                <Typography variant='body2' sx={{ mt: 1.5, color: 'text.secondary' }}>
                    {subMessage}
                </Typography>
            )}
        </Box>
    </Box>
);

export default LoadingOverlay;
