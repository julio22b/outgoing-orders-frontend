import { capitalize, Card, CardContent, Typography } from '@mui/material';

interface OrderCardProps {
    title: string;
    amount: number;
}

const OrderCard = ({ title, amount }: OrderCardProps) => {
    return (
        <Card 
            variant='outlined'
            sx={{ 
                width: '25%', 
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)'
                }
            }} 
        >
            <CardContent>
                <Typography variant='caption' color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.15em' }}>
                    {capitalize(title)}
                </Typography>
                <Typography variant='h3' sx={{ fontWeight: 600 }}>
                    {amount}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default OrderCard;
