import { InputLabel, InputLabelProps } from '@mui/material';

type StyledInputLabelProps = InputLabelProps & {
  children: string;
};

export const StyledInputLabel = ({ children, ...props }: StyledInputLabelProps) => {
  return (
    <InputLabel
      {...props}
      sx={{
        mb: 1,
        ml: 2,
        fontSize: 12,
        lineHeight: '16px',
        color: (theme) => theme.palette.grey['700']
      }}
    >
      {children}
    </InputLabel>
  );
};
