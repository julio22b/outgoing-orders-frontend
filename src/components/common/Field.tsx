import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { colors, rule } from '../../app/theme';

interface FieldProps {
    label: string;
    children: ReactNode;
    bordered?: boolean;
    required?: boolean;
    htmlFor?: string;
    sx?: SxProps<Theme>;
}

const Field = ({ label, children, bordered = false, required = false, htmlFor, sx }: FieldProps) => (
    <Box
        sx={{
            px: 1.25,
            py: 1,
            minWidth: 0,
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
