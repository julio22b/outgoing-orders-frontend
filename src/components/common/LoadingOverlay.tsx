import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

interface LoadingOverlayProps {
    message?: string;
    subMessage?: string;
}

const LoadingOverlay = ({ message, subMessage }: LoadingOverlayProps) => (
    <Backdrop open={true} sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2 })}>
        <CircularProgress />
        {message && (
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="white" sx={{ fontWeight: 600 }}>
                    {message}
                </Typography>
                {subMessage && (
                    <Typography variant="body2" color="white" sx={{ mt: 0.5, opacity: 0.7 }}>
                        {subMessage}
                    </Typography>
                )}
            </Box>
        )}
    </Backdrop>
);

export default LoadingOverlay;
