import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { colors } from '../../app/theme';

/** Must match the rotation inside the `stampIn` keyframe in theme.ts. */
const STAMP_ROTATION = 'rotate(-3deg)';

interface StampProps {
    label: string;
    /** `stamp` is for the order's current state; `ink` for states already passed. */
    tone?: 'ink' | 'stamp';
    size?: 'sm' | 'lg';
    /** Plays the stamp-down when the status has just changed under the viewer. */
    animate?: boolean;
    sx?: SxProps<Theme>;
}

/**
 * The one bold element in the app, and the only place all-caps appears.
 *
 * Everything else — labels, headings, column names — stays sentence case so that
 * a stamp reads as a mark made on the sheet rather than as more interface.
 */
const Stamp = ({ label, tone = 'ink', size = 'sm', animate = false, sx }: StampProps) => {
    const color = tone === 'stamp' ? colors.stamp : colors.ink;

    return (
        <Box
            sx={{
                display: 'inline-block',
                border: `2px solid ${color}`,
                color,
                px: size === 'lg' ? 2 : 1,
                py: size === 'lg' ? 1 : 0.5,
                transform: STAMP_ROTATION,
                opacity: 0.88,
                flexShrink: 0,
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
};

export default Stamp;
