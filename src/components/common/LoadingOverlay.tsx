import { Box, CircularProgress } from "@mui/material";

const LoadingOverlay = () => (
    <Box
        sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(227, 227, 227, 0.69)',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <CircularProgress />
    </Box>
);

export default LoadingOverlay;

