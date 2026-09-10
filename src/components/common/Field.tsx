import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { colors, rule } from '../../app/theme';

interface FieldProps {
    label: string;
    children: ReactNode;
    /** Draws the field's own box. Cells inside a ruled table get their edges from the grid instead. */
    bordered?: boolean;
    htmlFor?: string;
    sx?: SxProps<Theme>;
}

/**
 * A labelled box on a form — the app's main structural device, standing in for
 * every card the old design used.
 *
 * The label sits inside the box in the top-left corner, the way a printed form
 * prints its field names, so a label is always attached to the value it names
 * rather than floating above a section as an eyebrow.
 */
const Field = ({ label, children, bordered = false, htmlFor, sx }: FieldProps) => (
    <Box
        sx={{
            px: 1.25,
            py: 1,
            minWidth: 0,
            ...(bordered && { border: rule.hair, backgroundColor: colors.field }),
            ...sx,
        }}
    >
        <Typography
            variant='label'
            component={htmlFor ? 'label' : 'span'}
            {...(htmlFor ? { htmlFor } : {})}
            sx={{ display: 'block', color: 'text.secondary', mb: 0.75 }}
        >
            {label}
        </Typography>
        {children}
    </Box>
);

export default Field;
