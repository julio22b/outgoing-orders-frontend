import { Card, CardContent, Typography } from '@mui/material';

interface OrderCardProps {
    title: string;
    amount: number;
}

const OrderCard = ({ title, amount }: OrderCardProps) => {
    return (
        <Card sx={{ width: '20%' }}>
            <CardContent>
                <Typography gutterBottom>{title}</Typography>
                <Typography>{amount}</Typography>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
