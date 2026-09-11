import { MenuItem, Select } from '@mui/material';
import { capitalize } from '@mui/material';
import { controlSx } from '../../common/fieldStyles';

interface SelectFilterProps {
    id: string;
    value: string;
    options: string[];
    handleChange: (value: string) => void;
}

/**
 * The label lives on the enclosing Field, so this renders the control alone —
 * no FormControl, no floating label animation.
 */
const SelectFilter = ({ id, value, options, handleChange }: SelectFilterProps) => (
    <Select
        id={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        variant='outlined'
        fullWidth
        sx={controlSx}
    >
        {options.map((option) => (
            <MenuItem key={option} value={option}>
                {capitalize(option)}
            </MenuItem>
        ))}
    </Select>
);

export default SelectFilter;
