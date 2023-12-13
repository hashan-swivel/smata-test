import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface AutocompleteSelectProps {
  id: string;
  options: Option[];
  placeholder: string;
  multiple?: boolean;
  fullWidth?: boolean;
  defaultValue?: Option | Option[];
}

export const AutoCompleteSelect: React.FC<AutocompleteSelectProps> = ({
  id,
  options,
  placeholder,
  fullWidth = true,
  multiple = false,
  defaultValue
}) => {
  return (
    <Autocomplete
      id={id}
      fullWidth={fullWidth}
      options={options}
      getOptionLabel={(option: Option) => option.label}
      isOptionEqualToValue={(option: Option, value) => option.value === value.value}
      multiple={multiple}
      disablePortal
      defaultValue={defaultValue}
      sx={{ paddingBottom: '10px' }}
      renderInput={(params) => <TextField placeholder={placeholder} variant='filled' {...params} />}
    />
  );
};
