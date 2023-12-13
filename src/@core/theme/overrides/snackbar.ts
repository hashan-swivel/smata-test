// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Snackbar = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor:
            theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[100]
        }
      }
    }
  };
};

export default Snackbar;
