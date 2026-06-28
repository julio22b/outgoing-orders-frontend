import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '../../app/theme';

interface LoadingOverlayProps {
    message?: string;
    subMessage?: string;
    absolute?: boolean;
}

const LoadingOverlay = ({ message, subMessage, absolute }: LoadingOverlayProps) => (
    <Box
        sx={{
            position: absolute ? 'absolute' : 'fixed',
            inset: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: colors.pageBg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
        }}
    >
        <CircularProgress sx={{ color: colors.accentClay }} />
        {message && (
            <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant='h6' sx={{ fontWeight: 600, color: colors.textPrimary }}>
                    {message}
                </Typography>
                {subMessage && (
                    <Typography variant='body2' sx={{ mt: 0.5, color: colors.textSecondary }}>
                        {subMessage}
                    </Typography>
                )}
            </Box>
        )}
    </Box>
);

export default LoadingOverlay;
