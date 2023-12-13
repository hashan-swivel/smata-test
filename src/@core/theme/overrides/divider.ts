// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Divider = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: `${theme.spacing(2)} 0`,
          borderWidth: 1.5
        }
      }
    }
  };
};

export default Divider;
