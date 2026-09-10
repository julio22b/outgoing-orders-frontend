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
    /** The sheet. The only ground in the app — there are no raised surfaces. */
    paper: '#E9E9E1',
    /** A second sheet, for fields recessed into the form. */
    field: '#E2E2D9',

    /** Ink is never pure black; it's a dense warm brown-black. 13.4:1 on paper. */
    ink: '#221F1A',
    /** Secondary text. 6.4:1 on paper. */
    inkMuted: '#57524A',
    /** Pending and placeholder states. 3.5:1 — large text and non-text only. */
    inkFaint: '#807A6E',

    /** Low-emphasis separator between entries. Decorative, so no contrast floor. */
    ruleHair: '#CFCDC2',
    /**
     * Section bounds and the boxes around form fields. Because it's the only
     * thing marking where an input is, it has to clear WCAG 1.4.11's 3:1 against
     * both surfaces it touches — 3.3:1 on paper, 3.1:1 on field.
     */
    ruleMid: '#847F72',

    /**
     * The one spot color. Oxide red, 5.6:1 on paper.
     * Reserved for: high priority, destructive actions, and live event flashes.
     * If you are reaching for this and it is not an exception state, use ink.
     */
    stamp: '#A6301F',
    /** Fades out behind a row that just changed. Never a permanent fill. */
    stampWash: '#EFDFDB',
    /** Hover only. Kept translucent so it can sit over paper or a mark alike. */
    hoverWash: 'rgba(34, 31, 26, 0.045)',
} as const;

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
        docket: React.CSSProperties;
        display: React.CSSProperties;
        figure: React.CSSProperties;
        entry: React.CSSProperties;
        data: React.CSSProperties;
        label: React.CSSProperties;
        stamped: React.CSSProperties;
    }
    interface TypographyVariantsOptions {
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

        /** The order number on a detail sheet. Quiet enough to let the stamp lead. */
        docket: {
            fontFamily: MONO,
            fontSize: '3rem',
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        },
        /** Page title. Narrow, so it reads as a form heading rather than a masthead. */
        display: {
            fontFamily: SANS,
            fontSize: '2.125rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            ...width(88),
        },
        /** Counts and quantities. Tabular so columns of them align. */
        figure: {
            fontFamily: MONO,
            fontSize: '1.5rem',
            fontWeight: 400,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
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
            fontSize: '0.6875rem',
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
                    backgroundColor: colors.paper,
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
                root: { backgroundColor: 'rgba(34, 31, 26, 0.45)' },
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
