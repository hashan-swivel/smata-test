// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const List = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 0,
          marginRight: theme.spacing(1.5),
          color: theme.palette.text.secondary
        }
      }
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: 0,
          marginRight: theme.spacing(4)
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            lineHeight: 'normal'
          }
        },
        dense: {
          '& .MuiListItemText-primary': {
            color: theme.palette.text.primary
          }
        }
      }
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'uppercase',
          color: theme.palette.text.primary
        }
      }
    }
  };
};

export default List;
