import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface SelectFilterProps {
    name: string;
    value: string;
    options: string[];
    setState: (value: string) => void;
}

const SelectFilter = ({ name, value, options, setState }: SelectFilterProps) => {
    const id = `${name}-select`;

    return (
        <FormControl fullWidth>
            <InputLabel id={id}>
                {`${name[0].toUpperCase()}${name.slice(1)}`}
            </InputLabel>
            <Select labelId={id} id={id} value={value} label={name} onChange={(e) => setState(e.target.value)}>
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {`${option[0].toUpperCase()}${option.slice(1)}`}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectFilter;
