import { rule } from '../../app/theme';

/**
 * Makes a control sit directly beneath its Field label, with the enclosing box
 * providing the only edges. Padding is zeroed in the theme, so this only has to
 * clear the control's own fill.
 */
export const controlSx = {
    backgroundColor: 'transparent',
    '& .MuiInputBase-root': { backgroundColor: 'transparent' },
    '& .MuiPickersInputBase-root': { backgroundColor: 'transparent' },
    '& .MuiFormHelperText-root': { marginInline: 0, marginTop: '6px' },
} as const;

/** Cells in a ruled table share their edges, the way boxes on a printed form do. */
export const sharedEdgeSx = {
    borderRight: { sm: rule.hair },
    borderBottom: { xs: rule.hair, sm: 'none' },
    '&:last-of-type': { borderRight: 'none', borderBottom: 'none' },
} as const;
