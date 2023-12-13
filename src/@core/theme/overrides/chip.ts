// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Chip = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiChip: {
      styleOverrides: {
        outlined: {
          '&.MuiChip-colorDefault': {
            borderColor: `rgba(${theme.palette.primary}, 0.22)`
          }
        },
        deleteIcon: {
          width: 18,
          height: 18
        }
      }
    }
  };
};

export default Chip;
