import type React from 'react';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { colors, stampInk, STAMP_ROTATION } from '../../app/theme';

interface StampProps {
    label: string;
    color?: string;
    filled?: boolean;
    size?: 'sm' | 'lg';
    animate?: boolean;
    component?: React.ElementType;
    sx?: SxProps<Theme>;
}

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
            flexShrink: 0,
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
