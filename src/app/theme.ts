import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: { 
            default: '#0b0e14', 
            paper: '#151921' 
        },
        primary: { 
            main: '#5c8aff', 
            contrastText: '#ffffff' 
        },
        secondary: {
            main: '#d7d7d7',
            contrastText: '#ffffff',
        },
        success: { 
            main: '#4ade80' 
        },
        divider: 'rgba(255, 255, 255, 0.08)',
        text: { 
            primary: '#f8fafc', 
            secondary: '#94a3b8' 
        },
    },
    shape: { borderRadius: 8 },
});

export default theme;
