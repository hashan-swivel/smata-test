// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const autocomplete = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            padding: '14px 16px',
            height: 48
          }
        }
      }
    }
  };
};

export default autocomplete;
