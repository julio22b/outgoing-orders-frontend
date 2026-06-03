import { Backdrop, CircularProgress } from '@mui/material';

const LoadingOverlay = () => (
    <Backdrop open={true} sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}>
        <CircularProgress />
    </Backdrop>
);

export default LoadingOverlay;
