import { Box, Button, Toolbar, Typography, AppBar as MuiAppBar } from '@mui/material';

const AppBar = () => {
    return (
        <MuiAppBar position='static'>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant='h6' component='div' sx={{ lineHeight: 1.2 }}>
                        Outgoing Orders
                    </Typography>
                    <Typography variant='caption' sx={{ opacity: 0.8, textTransform: 'uppercase' }}>
                        live dispatch board
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant='subtitle2'>Live</Typography>
                    <Button variant='contained' color='secondary' size='small'>
                        + New Order
                    </Button>
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
};

export default AppBar;
