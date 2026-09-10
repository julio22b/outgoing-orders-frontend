import { Box, Typography } from '@mui/material';
import Rule from '../common/Rule';

interface PackingListProps {
    products: string[];
}

/**
 * The packing list.
 *
 * Line numbers are here because a picker reads them aloud off a real one, not
 * for decoration — they're zero-padded so the mono column stays a fixed width.
 */
const PackingList = ({ products }: PackingListProps) => (
    <Box sx={{ mt: 5 }}>
        <Typography variant='entry' component='h2' sx={{ mb: 1 }}>
            Items
        </Typography>
        <Rule weight='mid' />

        {products.length === 0 ? (
            <Typography variant='data' sx={{ color: 'text.disabled', display: 'block', px: 1.5, py: 2 }}>
                Nothing on this order yet
            </Typography>
        ) : (
            products.map((product, index) => (
                <Box key={`${product}-${index}`}>
                    {index > 0 && <Rule weight='hair' />}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2.5, py: 1.25, px: 1.5 }}>
                        <Typography variant='data' sx={{ color: 'text.disabled', flexShrink: 0 }}>
                            {String(index + 1).padStart(2, '0')}
                        </Typography>
                        <Typography variant='body1' sx={{ overflowWrap: 'anywhere' }}>
                            {product}
                        </Typography>
                    </Box>
                </Box>
            ))
        )}
    </Box>
);

export default PackingList;
