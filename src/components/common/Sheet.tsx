import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { colors, paperGrain, rule } from '../../app/theme';

interface SheetProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
}

const Sheet = ({ children, sx }: SheetProps) => (
    <Box
        sx={{
            position: 'relative',
            maxWidth: 1320,
            minHeight: '100vh',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 5 },
            backgroundColor: colors.paper,
            borderLeft: { md: rule.mid },
            borderRight: { md: rule.mid },
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage: paperGrain,
                opacity: 0.16,
                mixBlendMode: 'multiply',
            },
            '& > *': { position: 'relative' },
            ...sx,
        }}
    >
        {children}
    </Box>
);

export default Sheet;
