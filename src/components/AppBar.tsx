import { Box, Button, Toolbar, Typography, AppBar as MuiAppBar } from '@mui/material';
import { useState } from 'react';
import OutgoingOrdersForm from './OutgoingOrdersForm/OutgoingOrdersForm';

const AppBar = () => {
    const [isCreateOutgoingOrderFormOpen, setIsCreateOutgoingOrderFormOpen] = useState(false);

    return (
        <MuiAppBar
            position='static'
            color='inherit'
            elevation={0}
            sx={{
                backgroundColor: 'rgba(21, 25, 33, 0.8)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                paddingTop: '1em',
                paddingBottom: '1em',
            }}
        >
            <Toolbar disableGutters sx={{ justifyContent: 'space-between', px: '17px' }}>
                <Box>
                    <Typography variant='h5' component='div' sx={{ lineHeight: 1.2, fontWeight: 600 }}>
                        Outgoing Orders
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{
                            color: 'text.secondary',
                            letterSpacing: '0.15em',
                            fontWeight: 700,
                        }}
                    >
                        Live Dispatch Board
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
