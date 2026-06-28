import { capitalize, Chip } from '@mui/material';
import { STATUS_COLORS } from '../../app/constants';

interface CustomChipPropsInterface {
    title: string;
}

const CustomChip = ({ title }: CustomChipPropsInterface) => {
    const chipStyle = STATUS_COLORS[title] || { background: '#9e9e9e' };

    return (
        <Chip
            label={capitalize(title)}
            size='small'
            sx={{ ...chipStyle, width: 'fit-content', fontWeight: 'bold', fontSize: '12px' }}
        />
    );
};

export default CustomChip;
