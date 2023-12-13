// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

// ** Util Import
import { hexToRGBA } from '../utils/hex-to-rgba';

const Backdrop = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor:
            theme.palette.mode === 'light'
              ? hexToRGBA(theme.palette.grey['900'], 0.25)
              : hexToRGBA(theme.palette.background.default, 0.7)
        },
        invisible: {
          backgroundColor: 'transparent'
        }
      }
    }
  };
};

export default Backdrop;
