// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Rating = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiRating: {
      styleOverrides: {
        root: {
          color: theme.palette.warning.main
        }
      }
    }
  };
};

export default Rating;
