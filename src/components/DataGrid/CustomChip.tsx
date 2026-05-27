import { Chip } from '@mui/material';
import { STATUS_COLORS } from '../../app/constants';

interface CustomChipPropsInterface {
    title: string;
}

const CustomChip = ({ title }: CustomChipPropsInterface) => {
    const chipStyle = STATUS_COLORS[title] || { background: '#9e9e9e' };

    return (
        <Chip label={title} size='small' sx={{ ...chipStyle, width: '90px', fontWeight: 'bold', fontSize: '12px' }} />
    );
};

export default CustomChip;
