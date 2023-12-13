// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Switch = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-track': {
            backgroundColor: `rgb(${theme.palette.primary})`
          }
        }
      }
    }
  };
};

export default Switch;
