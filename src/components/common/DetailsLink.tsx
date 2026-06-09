import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import theme from '../../app/theme';

interface DetailsLinkProps {
    orderId: number;
    component?: ReactNode;
}

const DetailsLink = ({ orderId, component }: DetailsLinkProps) => {
    return (
        <Link
            to={`/orders/${orderId}`}
            state={{ orderId: orderId }}
            style={{
                textDecoration: 'none',
                color: theme.palette.primary.main,
                fontWeight: 'bold',
            }}
        >
            {component || `Order-${orderId}`}
        </Link>
    );
};

export default DetailsLink;
