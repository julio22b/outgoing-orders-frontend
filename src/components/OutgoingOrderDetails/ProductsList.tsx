import { List, ListItem, ListSubheader } from '@mui/material';
import theme from '../../app/theme';

interface ProductsListInterface {
    products: string[];
}

const ProductsList = ({ products }: ProductsListInterface) => {
    return (
        <List
            sx={{ bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, borderRadius: '10px' }}
            subheader={<ListSubheader sx={{ borderRadius: '10px' }}>Items</ListSubheader>}
        >
            {products.map((product) => (
                <ListItem>{product}</ListItem>
            ))}
        </List>
    );
};

export default ProductsList;
