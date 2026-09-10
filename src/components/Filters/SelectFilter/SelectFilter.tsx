import { MenuItem, Select } from '@mui/material';
import { capitalize } from '@mui/material';

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
        sx={{
            backgroundColor: 'transparent',
            '& .MuiSelect-select': { padding: 0, fontSize: '0.875rem' },
            '& .MuiSelect-icon': { right: 0 },
        }}
    >
        {options.map((option) => (
            <MenuItem key={option} value={option}>
                {capitalize(option)}
            </MenuItem>
        ))}
    </Select>
);

export default SelectFilter;
