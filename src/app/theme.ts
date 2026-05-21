import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0f1117', paper: '#161b27' },
    primary: { main: '#4f7cff' },
    success: { main: '#4caf50' },
    divider: '#2a3148',
  },
  shape: { borderRadius: 6 },
})

export default theme