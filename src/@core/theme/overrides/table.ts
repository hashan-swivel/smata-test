// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Table = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: theme.shadows[0],
          borderTopColor: theme.palette.divider
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          '& .MuiTableCell-head': {
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.13px',
            padding: theme.spacing(2)
          }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-body': {
            letterSpacing: '0.25px',
            // color: theme.palette.text.secondary,
            '&:not(.MuiTableCell-sizeSmall):not(.MuiTableCell-paddingCheckbox):not(.MuiTableCell-paddingNone)':
              {
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2)
              }
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head:first-of-type, & .MuiTableCell-root:first-of-type ': {
            paddingLeft: `${theme.spacing(2)} !important`
          },
          '& .MuiTableCell-head:last-child, & .MuiTableCell-root:last-child': {
            paddingRight: `${theme.spacing(2)} !important`
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiButton-root': {
            textTransform: 'uppercase'
            // color: theme.palette.text.secondary
          }
        }
      }
    }
  };
};

export default Table;
