import { Box, Button, Toolbar, Typography, AppBar as MuiAppBar } from '@mui/material';
import { useState } from 'react';
import OutgoingOrdersForm from './OutgoingOrdersForm/OutgoingOrdersForm';
import theme from '../app/theme';

const AppBar = () => {
    const [isCreateOutgoingOrderFormOpen, setIsCreateOutgoingOrderFormOpen] = useState(false);

    return (
        <MuiAppBar
            position='static'
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.default,
                paddingTop: '1em',
                paddingBottom: '1em',
            }}
        >
            <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: '17px' }}>
                <Box>
                    <Typography
                        variant='h4'
                        sx={{
                            fontWeight: 700,
                            fontSize: '2.5em',
                            color: theme.palette.text.primary,
                        }}
                    >
                        Outgoing Orders
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{
                            color: 'text.secondary',
                            letterSpacing: '0.2em',
                            fontWeight: 600,
                        }}
                    >
                        LIVE DISPATCH BOARD
                    </Typography>
                </Box>

                <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}
                >
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
                    <Button
                        variant='contained'
                        onClick={() => setIsCreateOutgoingOrderFormOpen(true)}
                        sx={{
                            fontWeight: 600,
                        }}
                    >
                        + New Order
                    </Button>
                </Box>
            </Toolbar>
            <OutgoingOrdersForm
                key={isCreateOutgoingOrderFormOpen ? 'open' : 'closed '}
                isCreateOutgoingOrderFormOpen={isCreateOutgoingOrderFormOpen}
                closeForm={() => setIsCreateOutgoingOrderFormOpen(false)}
                orderToEdit={null}
            />
        </MuiAppBar>
    );
};

export default AppBar;
