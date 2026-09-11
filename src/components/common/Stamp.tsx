import type React from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { colors, stampInk } from '../../app/theme';

/** Must match the rotation inside the `stampIn` keyframe in theme.ts. */
const STAMP_ROTATION = 'rotate(-3deg)';

interface StampProps {
    label: string;
    /** Defaults to ink. Status stamps pass their own colour. */
    color?: string;
    /**
     * Solid rather than outlined. Reserved for exceptions (rush), so a glance
     * separates "this needs attention" from "this is the state" by shape alone,
     * not by hue — which keeps working for a colourblind reader.
     */
    filled?: boolean;
    size?: 'sm' | 'lg';
    /** Plays the stamp-down when the status has just changed under the viewer. */
    animate?: boolean;
    component?: React.ElementType;
    sx?: SxProps<Theme>;
}

/**
 * The app's signature mark, and the only place all-caps appears.
 */
const Stamp = ({
    label,
    color = colors.ink,
    filled = false,
    size = 'sm',
    animate = false,
    component,
    sx,
}: StampProps) => (
    <Box
        {...(component ? { component } : {})}
        sx={{
            display: 'inline-block',
            border: `2px solid ${color}`,
            backgroundColor: filled ? color : 'transparent',
            color: filled ? colors.paper : color,
            px: size === 'lg' ? 2 : 1,
            py: size === 'lg' ? 1 : 0.5,
            transform: STAMP_ROTATION,
            opacity: 0.9,
            flexShrink: 0,
            // Broken ink coverage — the mark reads as pressed, not drawn.
            maskImage: stampInk,
            WebkitMaskImage: stampInk,
            maskSize: '40px 40px',
            WebkitMaskSize: '40px 40px',
            ...(animate && { animation: 'stampIn 180ms cubic-bezier(.2,.9,.3,1) both' }),
            ...sx,
        }}
    >
        <Typography
            variant='stamped'
            component='span'
            sx={{ display: 'block', fontSize: size === 'lg' ? '1.125rem' : undefined }}
        >
            {label}
        </Typography>
    </Box>
);

export default Stamp;
