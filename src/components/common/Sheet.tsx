import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { colors, paperGrain, rule } from '../../app/theme';

interface SheetProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
}

/**
 * The sheet everything is printed on.
 *
 * It used to be a bare max-width container on a page-wide background, which is
 * why the app read as a screen rather than a document. Now it's a surface with
 * edges, lying on the desk, with enough tooth to look like stock.
 */
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
            // Tooth sits under the content and never intercepts a click.
            '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage: paperGrain,
                opacity: 0.16,
                mixBlendMode: 'multiply',
            },
            // Everything printed on the sheet sits above the tooth.
            '& > *': { position: 'relative' },
            ...sx,
        }}
    >
        {children}
    </Box>
);

export default Sheet;
