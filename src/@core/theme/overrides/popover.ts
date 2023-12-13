// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Popover = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiPopover: {
      styleOverrides: {
        root: {
          '& .MuiPopover-paper': {
            boxShadow: theme.shadows[6]
          }
        }
      }
    }
  };
};

export default Popover;
