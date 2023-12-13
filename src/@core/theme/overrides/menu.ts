// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Menu = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiMenu: {
      styleOverrides: {
        root: {
          '& .MuiMenu-paper': {
            borderRadius: 2,
            boxShadow: theme.palette.mode === 'light' ? theme.shadows[8] : theme.shadows[9]
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.MuiTablePagination-menuItem': {
            width: 96
          },
          padding: '14px 16px 14px 16px',
          '& .MuiListItemIcon-root': {
            minWidth: 0
          }
        }
      }
    }
  };
};

export default Menu;
