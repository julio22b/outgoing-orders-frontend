import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

/**
 * MANIFEST
 *
 * The screen is a dispatch manifest that happens to be live — not a dashboard
 * dressed as paper. Three rules govern every decision here:
 *
 *   1. No invented chrome. Every mark on screen maps to real data.
 *   2. Color is never decorative. `stamp` marks exceptions and nothing else.
 *   3. Structure comes from rules and boxed fields, never from cards or shadows.
 *
 * Light only, deliberately. A manifest is paper.
 */

export const colors = {
    /**
     * Every surface used to sit at hue 37-55 degrees — khaki — with paper at 19%
     * saturation, which is why the app read as a sun-faded manila envelope. The
     * palette is now cool and near-neutral (8% saturation at most) so paper
     * reads as paper and the one red stops going autumnal against it.
     */
    /** What the sheet lies on. */
    desk: '#C6C7C9',
    /** The sheet itself. */
    paper: '#F1F2F3',
    /** Fields recessed into the form. */
    field: '#E4E6E8',

    /** 15.4:1 on paper. */
    ink: '#1A1B1D',
    /** Secondary text. 6.6:1 on paper. */
    inkMuted: '#52565A',
    /** Pending and placeholder states. 3.7:1 — large text and non-text only. */
    inkFaint: '#797E83',

    /** Low-emphasis separator between entries. Decorative, so no contrast floor. */
    ruleHair: '#D2D5D8',
    /**
     * Section bounds and the boxes around form fields. Clears WCAG 1.4.11's 3:1
     * against both surfaces it touches — 3.5:1 on paper, 3.1:1 on field.
     */
    ruleMid: '#7C8186',

    /** Reversed out of the ink band in the letterhead. 15.4:1 on ink. */
    onInk: '#F1F2F3',
    /** Secondary text inside the band. 7.7:1 on ink. */
    onInkMuted: '#A9AEB3',

    /**
     * Exceptions: high priority, destructive actions, live event flashes. 5.6:1.
     * It stays distinct from the status colours below by shape, not just hue —
     * a rush stamp is filled solid, a status stamp is outlined.
     */
    stamp: '#B23122',
    /** The same signal inside the ink band, where the dark red would vanish. 5.2:1 on ink. */
    stampOnInk: '#E0695B',
    /** Fades out behind a row that just changed. Never a permanent fill. */
    stampWash: '#F7E2DE',
    /** Hover only. Kept translucent so it can sit over paper or a mark alike. */
    hoverWash: 'rgba(26, 27, 29, 0.05)',
} as const;

/**
 * Each status carries its own colour again, the way it did before the redesign,
 * but expressed as ink and as the tint of a carbon-copy sheet rather than as a
 * pastel pill. `ink` clears 4.5:1 on paper; `tint` is faint enough that body
 * text and rules stay legible over it.
 */
export const statusColors = {
    picking: { ink: '#8A600C', tint: '#F2ECDD' },
    packed: { ink: '#2E6A4C', tint: '#DCEAE0' },
    dispatched: { ink: '#2A5E8C', tint: '#DAE5EF' },
    delayed: { ink: '#B23122', tint: '#F7E2DE' },
} as const;

export type StatusKey = keyof typeof statusColors;

export const statusColor = (status: string) =>
    statusColors[status as StatusKey] ?? { ink: '#1A1B1D', tint: 'transparent' };

/**
 * Paper tooth. Grey noise multiplied over the sheet at low opacity — the
 * difference between stock and a background color.
 */
export const paperGrain =
    `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>` +
    `<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' stitchTiles='stitch'/>` +
    `<feColorMatrix type='saturate' values='0'/></filter>` +
    `<rect width='160' height='160' filter='url(%23g)'/></svg>")`;

/**
 * Broken ink coverage, used as a mask so a stamp reads as pressed rather than
 * drawn. The speckle has to stay finer than the letterforms and never drop
 * below ~68% coverage, or it stops looking like ink and starts looking like a
 * rendering fault.
 */
export const stampInk =
    `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>` +
    `<filter id='s'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='1' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.42 0 0 0 0.68'/></filter>` +
    `<rect width='40' height='40' filter='url(%23s)'/></svg>")`;

/** Three weights, and no others. All structure in the app is built from these. */
export const rule = {
    hair: `1px solid ${colors.ruleHair}`,
    mid: `1px solid ${colors.ruleMid}`,
    heavy: `2px solid ${colors.ink}`,
} as const;

const SANS = "'Archivo', system-ui, -apple-system, sans-serif";
/** Figures only — IDs, counts, timestamps. Never labels. */
const MONO = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/** Archivo carries a width axis; using it is cheaper and rarer than adding a face. */
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
        // Retire the stock scale so nothing drifts back onto it.
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
        // Both were previously undefined, so MUI's stock orange (#ed6c02) and
        // purple (#9c27b0) were rendering inside the palette. They are declared
        // now so nothing can fall through again.
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

        /**
         * The app's face, and the one place the width axis is pushed hard enough
         * to register — wdth 62 is narrow ledger lettering, not a default sans.
         */
        masthead: {
            fontFamily: SANS,
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
            lineHeight: 0.92,
            textTransform: 'uppercase',
            ...width(62),
        },
        /** The order number on a detail sheet. Quiet enough to let the stamp lead. */
        docket: {
            fontFamily: MONO,
            fontSize: '3rem',
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        },
        /** Section and record headings, below the masthead. */
        display: {
            fontFamily: SANS,
            fontSize: '2.125rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            ...width(88),
        },
        /** The day's tally — the first thing on the sheet worth reading. */
        tally: {
            fontFamily: MONO,
            fontSize: '2.75rem',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        },
        /** Secondary counts, e.g. per column. Deliberately smaller than `tally`. */
        figure: {
            fontFamily: MONO,
            fontSize: '1.25rem',
            fontWeight: 400,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        },
        /** Section headings. Narrow, so they read as kin to the masthead. */
        section: {
            fontFamily: SANS,
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            ...width(72),
        },
        /** A consignee name — the thing an operator actually scans for. */
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
        /** IDs, timestamps, quantities inline. */
        data: {
            fontFamily: MONO,
            fontSize: '0.78125rem',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 1.4,
            fontVariantNumeric: 'tabular-nums',
        },
        /**
         * Field labels. Sentence case on purpose — tracked-out caps everywhere is
         * the single loudest tell in generated UI, so caps are spent in one place
         * only (the stamp) and this stays quiet.
         */
        label: {
            fontFamily: SANS,
            fontSize: '0.65625rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            lineHeight: 1.2,
            ...width(80),
        },
        /** The one place all-caps appears. */
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
                    // Figures line up in a column whether or not they're in a table.
                    fontVariantNumeric: 'tabular-nums',
                },
                // Motion is informational here: a stamp landing, an entry arriving,
                // a cursor waiting. Each is defined once and referenced by name.
                // The rotation here must match STAMP_ROTATION in Stamp.tsx: a
                // keyframe's transform replaces the element's, not adds to it.
                '@keyframes stampIn': {
                    from: { transform: 'scale(1.25) rotate(-3deg)', opacity: 0 },
                    to: { transform: 'scale(1) rotate(-3deg)', opacity: 0.88 },
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
                // Focus must stay visible: there are no shadows or fills to fall back on.
                ':focus-visible': {
                    outline: `2px solid ${colors.ink}`,
                    outlineOffset: '2px',
                },
            },
        },

        // Paper is the sheet, not a card. No border, no elevation — anything that
        // needs an edge asks for one explicitly.
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
                // The primary action inverts on hover, the way a stamped box does.
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

        // Inputs are boxed form fields: a ruled box with its label in the corner.
        // Never a floating pill, never a floating label.
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: colors.field,
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    // The notch is gone, so focus needs its own mark or the field
                    // gives a keyboard user nothing to follow.
                    '&.Mui-focused': {
                        outline: `2px solid ${colors.ink}`,
                        outlineOffset: '2px',
                    },
                },
                input: {
                    padding: '8px 10px',
                    '&::placeholder': { color: colors.inkFaint, opacity: 1 },
                },
            },
        },
        MuiSelect: {
            defaultProps: { MenuProps: { disableScrollLock: true } },
            styleOverrides: {
                select: { padding: '8px 10px' },
                icon: { color: colors.inkMuted },
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
                    '& .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
                    '&:hover .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': { border: 'none' },
                    '&.Mui-focused': {
                        outline: `2px solid ${colors.ink}`,
                        outlineOffset: '2px',
                    },
                },
            },
        },
        MuiPickersSectionList: {
            styleOverrides: { root: { padding: '8px 10px' } },
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
