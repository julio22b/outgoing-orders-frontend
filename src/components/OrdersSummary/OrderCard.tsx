import { Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { STATUS_COLORS } from '../../app/constants';

interface OrderCardProps {
    title: string;
    amount: number;
}

const OrderCard = ({ title, amount }: OrderCardProps) => {
    const loading = useAppSelector((state) => state.outgoingOrders.loading);

    return (
        <Card
            variant='outlined'
            sx={{
                width: '25%',
                transition: 'transform 0.2s, border-color 0.2s',
                position: 'relative',
                '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <CardContent
                sx={{
                    '::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '3px',
                        height: '100%',
                        backgroundColor: STATUS_COLORS[title]?.accent || 'primary.main',
                    },
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                    }}
                >
                    {title}
                </Typography>
                <Typography variant='h3' sx={{ fontWeight: 600 }}>
                    {loading ? <CircularProgress /> : amount || 0}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
