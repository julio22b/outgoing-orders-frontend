import { rule } from '../../app/theme';

export const controlSx = {
    backgroundColor: 'transparent',
    '& .MuiInputBase-root': { backgroundColor: 'transparent' },
    '& .MuiPickersInputBase-root': { backgroundColor: 'transparent' },
    '& .MuiFormHelperText-root': { marginInline: 0, marginTop: '6px' },
} as const;

export const sharedEdgeSx = {
    borderRight: { sm: rule.hair },
    borderBottom: { xs: rule.hair, sm: 'none' },
    '&:last-of-type': { borderRight: 'none', borderBottom: 'none' },
} as const;
