import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface SheetProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
}

/**
 * The sheet both routes are printed on. Previously the board ran full-bleed and
 * the detail page was centred at 1200px, so the two screens didn't line up.
 */
const Sheet = ({ children, sx }: SheetProps) => (
    <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, ...sx }}>{children}</Box>
);

export default Sheet;
