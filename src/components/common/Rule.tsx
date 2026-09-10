import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { colors } from '../../app/theme';

type Weight = 'hair' | 'mid' | 'heavy';

interface RuleProps {
    /** hair separates entries, mid bounds sections, heavy bounds the sheet. */
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

/**
 * Every structural line in the app comes from here. There are three weights and
 * no fourth — if something needs to be set apart, it gets a rule, not a card.
 */
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
