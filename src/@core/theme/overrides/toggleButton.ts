import { Theme, ThemeOptions } from '@mui/material';

const ToggleButton = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          border: 0,
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            ':hover': {
              backgroundColor: theme.palette.action.hover
            }
          }
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          border: 0,
          padding: 8,
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.hover
          }
        }
      }
    }
  };
};

export default ToggleButton;
