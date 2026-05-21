import { Box, Button, Toolbar, Typography, AppBar as MuiAppBar } from '@mui/material';

const AppBar = () => {
    return (
        <MuiAppBar
            position='static'
            color='inherit'
            elevation={0}
            sx={{
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: '17px' }}>
                <Box>
                    <Typography variant='h5' component='div' sx={{ lineHeight: 1.2, fontWeight: 600 }}>
                        Outgoing Orders
                    </Typography>
                    <Typography variant='subtitle2' sx={{ opacity: 0.6, textTransform: 'uppercase' }}>
                        LIVE DISPATCH BOARD
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                animation: 'pulse 2.5s infinite ease-in-out',
                                '@keyframes pulse': {
                                    '0%': { transform: 'scale(1)', opacity: 1 },
                                    '50%': { transform: 'scale(1.5)', opacity: 0.3 },
                                    '100%': { transform: 'scale(1)', opacity: 1 },
                                },
                            }}
                        />
                        <Typography variant='subtitle2' color='success' sx={{ fontWeight: 600 }}>
                            Live
                        </Typography>
                    </Box>
                    <Button variant='outlined' sx={{ color: 'white', fontWeight: 600 }}>
                        + New Order
                    </Button>
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
};

export default AppBar;
