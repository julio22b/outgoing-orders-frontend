import { Box, Button, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface ErrorNoticeProps {
    message: string;
    onRetry: () => void;
    sx?: SxProps<Theme>;
}

const ErrorNotice = ({ message, onRetry, sx }: ErrorNoticeProps) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, ...sx }}>
        <Typography variant='data' sx={{ color: 'text.secondary' }}>
            {message}
        </Typography>
        <Button variant='text' onClick={onRetry} sx={{ typography: 'data', minHeight: 30, px: 1 }}>
            Retry
        </Button>
    </Box>
);

export default ErrorNotice;
