// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Typography = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: theme.spacing(2)
        }
      }
    }
  };
};

export default Typography;
