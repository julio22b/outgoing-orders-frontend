import { Card, CardContent, Typography } from '@mui/material';

interface OrderCardProps {
    title: string;
    amount: number;
}

const OrderCard = ({ title, amount }: OrderCardProps) => {
    return (
        <Card sx={{ width: '25%', borderRadius: 0 }} variant='outlined'>
            <CardContent>
                <Typography variant='subtitle2' sx={{ padding: '1em 0', opacity: 0.6 }}>
                    {title}
                </Typography>
                <Typography variant='h3' sx={{ fontWeight: 600 }}>
                    {amount}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
