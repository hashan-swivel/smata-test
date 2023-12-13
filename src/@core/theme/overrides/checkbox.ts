import { Theme, ThemeOptions } from '@mui/material/styles';

const Checkbox = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[500]
        }
      }
    }
  };
};

export default Checkbox;
