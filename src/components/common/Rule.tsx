import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { colors } from '../../app/theme';

type Weight = 'hair' | 'mid' | 'heavy';

interface RuleProps {
    weight?: Weight;
    vertical?: boolean;
    sx?: SxProps<Theme>;
}

const THICKNESS: Record<Weight, number> = { hair: 1, mid: 1, heavy: 2 };
const COLOR: Record<Weight, string> = {
    hair: colors.ruleHair,
    mid: colors.ruleMid,
    heavy: colors.ink,
};

const Rule = ({ weight = 'hair', vertical = false, sx }: RuleProps) => (
    <Box
        aria-hidden
        sx={{
            flexShrink: 0,
            backgroundColor: COLOR[weight],
            ...(vertical
                ? { width: `${THICKNESS[weight]}px`, alignSelf: 'stretch' }
                : { height: `${THICKNESS[weight]}px`, width: '100%' }),
            ...sx,
        }}
    />
);

export default Rule;
