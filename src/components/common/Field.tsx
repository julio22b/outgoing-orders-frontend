import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { colors, rule } from '../../app/theme';

interface FieldProps {
    label: string;
    children: ReactNode;
    /** Draws the field's own box. Cells inside a ruled table get their edges from the grid instead. */
    bordered?: boolean;
    /** Marks the label; the input itself carries `required` for assistive tech. */
    required?: boolean;
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
const Field = ({ label, children, bordered = false, required = false, htmlFor, sx }: FieldProps) => (
    <Box
        sx={{
            px: 1.25,
            py: 1,
            minWidth: 0,
            // Focus marks the whole box, inset so it sits inside shared edges. A
            // ring on the input itself would hug the text, since inputs carry no
            // padding of their own.
            '&:focus-within': { outline: `2px solid ${colors.ink}`, outlineOffset: '-2px' },
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
            {required && (
                <Box component='span' aria-hidden sx={{ ml: 0.25 }}>
                    *
                </Box>
            )}
        </Typography>
        {children}
    </Box>
);

export default Field;
