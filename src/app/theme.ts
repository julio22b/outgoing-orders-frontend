import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

export const colors = {
    pageBg: '#f8f5ef', // app background
    surface: '#fdfcf8', // cards / panels
    surfaceCard: '#fffefb', // order cards (slightly lighter)
    inset: '#f9f6f2', // item rows / inset fields
    borderCard: '#e8e4dd',
    borderInput: '#e2ddd5',

    // Text
    textPrimary: '#342c27',
    heading: '#362b25',
    textSecondary: '#746d68',
    textMuted: '#908b86',

    // Accents (clay is primary; others are the tweak-panel options)
    accentClay: '#a1674c',
    accentSage: '#577b69',
    accentSlate: '#556b82',
    accentPlum: '#7c5378',

    // Status — { dot, bg, text }
    picking: { dot: '#d79e59', bg: '#fde3c4', text: '#804813' },
    packed: { dot: '#6aa085', bg: '#cbefdb', text: '#1d533c' },
    dispatched: { dot: '#5787a5', bg: '#cde9fd', text: '#22587a' },
    delayed: { dot: '#c15f4d', bg: '#ffe2db', text: '#a04130', solid: '#bd432f' },

    // Priority — { bg, text }
    priorityHigh: { bg: '#ffded5', text: '#a04130' },
    priorityNormal: { bg: '#ebe7e2', text: '#625d56' },
    priorityLow: { bg: '#d2edfc', text: '#286484' },

    // Misc
    successGreen: '#48a260', // "Live" indicator / success toast
    progressLine: '#78ae82', // timeline fill
    toastBg: '#251e18', // dark toast pill
    amber: '#c9963a', // product list bullet
} as const;

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: colors.accentClay, contrastText: '#fdfcf8' },
        error: { main: colors.delayed.solid, contrastText: '#fdfcf8' },
        success: { main: colors.successGreen },
        background: { default: colors.pageBg, paper: colors.surface },
        text: { primary: colors.textPrimary, secondary: colors.textSecondary },
        divider: colors.borderCard,
    },

    typography: {
        fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
        // Serif display face for titles & big numbers
        h1: { fontFamily: '"Spectral", serif', fontWeight: 600, letterSpacing: '-0.01em' },
        h2: { fontFamily: '"Spectral", serif', fontWeight: 600 },
        h3: { fontFamily: '"Spectral", serif', fontWeight: 600 },
        h4: { fontFamily: '"Spectral", serif', fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 600 },
        overline: { fontWeight: 700, letterSpacing: '0.07em' },
    },

    shape: { borderRadius: 12 },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: colors.pageBg, color: colors.textPrimary },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.borderCard}`,
                    backgroundImage: 'none',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: colors.inset,
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 11, paddingInline: 18 },
                outlined: {
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                    borderColor: colors.borderCard,
                    '&:hover': {
                        backgroundColor: colors.surface,
                        borderColor: colors.textMuted,
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface,
                    borderRadius: 10,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.borderInput,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.textMuted,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.accentClay,
                        borderWidth: 1.5,
                    },
                },
                input: {
                    color: colors.textPrimary,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: colors.textSecondary,
                    '&.Mui-focused': {
                        color: colors.accentClay,
                    },
                },
            },
        },
        MuiPickersOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.surface,
                    borderRadius: 10,
                    '& .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: colors.borderInput,
                    },
                    '&:hover .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: colors.textMuted,
                    },
                    '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: colors.accentClay,
                        borderWidth: 1.5,
                    },
                },
            },
        },
        MuiPickersTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: colors.textSecondary,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.accentClay,
                    },
                },
            },
        },
    },
});

export default theme;
