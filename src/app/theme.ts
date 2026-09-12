import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type { OrderStatus } from './types';

export const colors = {
    desk: '#C6C7C9',
    paper: '#F1F2F3',
    field: '#E4E6E8',

    ink: '#1A1B1D',
    inkMuted: '#52565A',
    inkFaint: '#797E83',

    ruleHair: '#D2D5D8',
    ruleMid: '#7C8186',

    onInk: '#F1F2F3',
    onInkMuted: '#A9AEB3',

    stamp: '#B23122',
    stampOnInk: '#E0695B',
    stampWash: '#F7E2DE',
    hoverWash: 'rgba(26, 27, 29, 0.05)',
} as const;

export const statusColors = {
    picking: { ink: '#714E07', tint: '#F2ECDD' },
    packed: { ink: '#24563D', tint: '#DCEAE0' },
    dispatched: { ink: '#204B72', tint: '#DAE5EF' },
    delayed: { ink: '#B23122', tint: '#F7E2DE' },
} as const satisfies Record<OrderStatus, { ink: string; tint: string }>;

export const statusColor = (status: OrderStatus) => statusColors[status];

export const paperGrain =
    `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>` +
    `<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' stitchTiles='stitch'/>` +
    `<feColorMatrix type='saturate' values='0'/></filter>` +
    `<rect width='160' height='160' filter='url(%23g)'/></svg>")`;

export const stampInk =
    `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>` +
    `<filter id='s'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='1' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.3 0 0 0 0.8'/></filter>` +
    `<rect width='40' height='40' filter='url(%23s)'/></svg>")`;

export const STAMP_ROTATION = 'rotate(-3deg)';

export const rule = {
    hair: `1px solid ${colors.ruleHair}`,
    mid: `1px solid ${colors.ruleMid}`,
    heavy: `2px solid ${colors.ink}`,
} as const;

const SANS = "'Archivo', system-ui, -apple-system, sans-serif";
const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const width = (wdth: number) => ({ fontVariationSettings: `'wdth' ${wdth}` });

declare module '@mui/material/styles' {
    interface TypographyVariants {
        masthead: React.CSSProperties;
        tally: React.CSSProperties;
        section: React.CSSProperties;
        docket: React.CSSProperties;
        display: React.CSSProperties;
        figure: React.CSSProperties;
        entry: React.CSSProperties;
        data: React.CSSProperties;
        label: React.CSSProperties;
        stamped: React.CSSProperties;
    }
    interface TypographyVariantsOptions {
        masthead?: React.CSSProperties;
        tally?: React.CSSProperties;
        section?: React.CSSProperties;
        docket?: React.CSSProperties;
        display?: React.CSSProperties;
        figure?: React.CSSProperties;
        entry?: React.CSSProperties;
        data?: React.CSSProperties;
        label?: React.CSSProperties;
        stamped?: React.CSSProperties;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        masthead: true;
        tally: true;
        section: true;
        docket: true;
        display: true;
        figure: true;
        entry: true;
        data: true;
        label: true;
        stamped: true;
        h1: false;
        h2: false;
        h3: false;
        h4: false;
        h5: false;
        h6: false;
        subtitle1: false;
        subtitle2: false;
        overline: false;
    }
}

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: colors.ink, contrastText: colors.paper },
        secondary: { main: colors.inkMuted, contrastText: colors.paper },
        warning: { main: colors.stamp, contrastText: colors.paper },
        error: { main: colors.stamp, contrastText: colors.paper },
        success: { main: colors.ink, contrastText: colors.paper },
        background: { default: colors.paper, paper: colors.paper },
        text: { primary: colors.ink, secondary: colors.inkMuted, disabled: colors.inkFaint },
        divider: colors.ruleHair,
    },

    shape: { borderRadius: 0 },

    typography: {
        fontFamily: SANS,
        htmlFontSize: 16,
        fontSize: 14,

        masthead: {
            fontFamily: SANS,
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
            lineHeight: 0.92,
            textTransform: 'uppercase',
            ...width(62),
        },
        docket: {
            fontFamily: MONO,
            fontSize: '3rem',
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        },
        display: {
            fontFamily: SANS,
            fontSize: '2.125rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            ...width(88),
        },
        tally: {
            fontFamily: MONO,
            fontSize: '2.75rem',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        },
        figure: {
            fontFamily: MONO,
            fontSize: '1.25rem',
            fontWeight: 400,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        },
        section: {
            fontFamily: SANS,
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            ...width(72),
        },
        entry: {
            fontFamily: SANS,
            fontSize: '1.0625rem',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            ...width(92),
        },
        body1: { fontFamily: SANS, fontSize: '0.875rem', lineHeight: 1.55 },
        body2: { fontFamily: SANS, fontSize: '0.8125rem', lineHeight: 1.5 },
        data: {
            fontFamily: MONO,
            fontSize: '0.78125rem',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 1.4,
            fontVariantNumeric: 'tabular-nums',
        },
        label: {
            fontFamily: SANS,
            fontSize: '0.65625rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            lineHeight: 1.2,
            ...width(80),
        },
        stamped: {
            fontFamily: SANS,
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            lineHeight: 1,
            ...width(85),
        },
        button: { fontFamily: SANS, fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: colors.desk,
                    color: colors.ink,
                    fontVariantNumeric: 'tabular-nums',
                },
                '@keyframes stampIn': {
                    from: { transform: `scale(1.25) ${STAMP_ROTATION}`, opacity: 0 },
                    to: { transform: `scale(1) ${STAMP_ROTATION}`, opacity: 1 },
                },
                '@keyframes entryIn': {
                    from: { transform: 'translateY(6px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 },
                },
                '@keyframes markFade': {
                    from: { backgroundColor: colors.stampWash },
                    to: { backgroundColor: 'transparent' },
                },
                '@keyframes caret': {
                    '0%, 45%': { opacity: 1 },
                    '50%, 95%': { opacity: 0 },
                },
                '@media (prefers-reduced-motion: reduce)': {
                    '*, *::before, *::after': {
                        animationDuration: '0.01ms !important',
                        animationIterationCount: '1 !important',
                        transitionDuration: '0.01ms !important',
                    },
                },
                ':focus-visible': {
                    outline: `2px solid ${colors.ink}`,
                    outlineOffset: '2px',
                },
            },
        },

        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: { backgroundColor: colors.paper, backgroundImage: 'none', boxShadow: 'none' },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: { border: rule.heavy, backgroundColor: colors.paper, boxShadow: 'none' },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: { backgroundColor: 'rgba(26, 27, 29, 0.5)' },
            },
        },

        MuiButtonBase: {
            styleOverrides: {
                root: {
                    '&.Mui-focusVisible': {
                        outline: `2px solid ${colors.ink}`,
                        outlineOffset: '2px',
                    },
                },
            },
        },

        MuiButton: {
            defaultProps: { disableElevation: true, disableRipple: true },
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    paddingInline: 14,
                    minHeight: 34,
                    transition: 'background-color 90ms linear, color 90ms linear',
                },
                contained: {
                    backgroundColor: colors.ink,
                    color: colors.paper,
                    '&:hover': { backgroundColor: colors.stamp },
                },
                outlined: {
                    borderColor: colors.ink,
                    borderWidth: 2,
                    color: colors.ink,
                    '&:hover': {
                        borderWidth: 2,
                        borderColor: colors.ink,
                        backgroundColor: colors.ink,
                        color: colors.paper,
                    },
                },
                text: {
                    color: colors.inkMuted,
                    '&:hover': { backgroundColor: 'transparent', color: colors.ink },
                },
            },
        },

        MuiIconButton: {
            defaultProps: { disableRipple: true },
            styleOverrides: { root: { borderRadius: 0 } },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: colors.field,
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                },
                input: {
                    padding: 0,
                    '&::placeholder': { color: colors.inkFaint, opacity: 1 },
                },
            },
        },
        MuiSelect: {
            defaultProps: { MenuProps: { disableScrollLock: true } },
            styleOverrides: {
                select: { padding: 0, paddingRight: '28px' },
                icon: { color: colors.inkMuted, right: 0 },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: { border: rule.mid, borderRadius: 0, marginTop: 2 },
                list: { paddingBlock: 0 },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                    '&.Mui-selected': { backgroundColor: colors.field },
                    '&:hover': { backgroundColor: colors.field },
                },
            },
        },
        MuiPickersOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: colors.field,
                    fontSize: '0.875rem',
                    paddingLeft: 0,
                    paddingRight: 0,
                    '& .MuiInputAdornment-root': { height: 'auto', maxHeight: 'none' },
                    '& .MuiInputAdornment-root .MuiIconButton-root': { marginBlock: '-7px' },
                    '& .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
                },
                sectionsContainer: { padding: 0 },
            },
        },
        MuiPickersSectionList: {
            styleOverrides: { root: { padding: 0 } },
        },

        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.ink,
                    color: colors.paper,
                    borderRadius: 0,
                    boxShadow: 'none',
                    fontFamily: SANS,
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: colors.ink,
                    color: colors.paper,
                    borderRadius: 0,
                    fontFamily: MONO,
                    fontSize: '0.75rem',
                    fontWeight: 400,
                },
            },
        },
    },
});

export default theme;
