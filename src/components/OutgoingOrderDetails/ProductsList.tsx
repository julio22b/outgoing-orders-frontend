import { Box, List, ListItem, Tooltip, Typography } from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';
import theme, { colors } from '../../app/theme';

interface ProductsListInterface {
    products: string[];
}

const ProductsList = ({ products }: ProductsListInterface) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1em',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '10px',
            }}
        >
            <Typography variant='h6' sx={{ color: 'text.secondary', fontWeight: 600, margin: '14px 0 0 14px' }}>
                Items
            </Typography>
            <List
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75em',
                    padding: '0 14px 14px',
                }}
            >
                {products.map((product) => (
                    <Tooltip key={product} title={product} placement='top'>
                        <ListItem
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: `1px solid ${colors.borderInput}`,
                                backgroundColor: colors.inset,
                                borderRadius: '10px',
                                overflow: 'hidden',
                            }}
                        >
                            <SquareIcon sx={{ fontSize: 10, color: colors.amber, flexShrink: 0 }} />
                            <Typography
                                variant='body2'
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {product}
                            </Typography>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );
};

export default ProductsList;
