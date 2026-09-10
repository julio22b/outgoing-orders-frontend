import { rule } from '../../app/theme';

/**
 * Strips a control's own chrome so it sits directly beneath its Field label,
 * with the enclosing box providing the only edges.
 */
export const controlSx = {
    backgroundColor: 'transparent',
    '& input': { padding: 0, fontSize: '0.875rem' },
    '& .MuiInputBase-root': { backgroundColor: 'transparent' },
    '& .MuiPickersInputBase-root': { backgroundColor: 'transparent' },
    '& .MuiPickersSectionList-root': { padding: 0, fontSize: '0.875rem' },
    '& .MuiSelect-select': { padding: 0, fontSize: '0.875rem' },
    '& .MuiFormHelperText-root': { marginInline: 0, marginTop: '6px' },
} as const;

/** Cells in a ruled table share their edges, the way boxes on a printed form do. */
export const sharedEdgeSx = {
    borderRight: { sm: rule.hair },
    borderBottom: { xs: rule.hair, sm: 'none' },
    '&:last-of-type': { borderRight: 'none', borderBottom: 'none' },
} as const;
