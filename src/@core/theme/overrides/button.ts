// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Button = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 2,
          lineHeight: 1.71,
          letterSpacing: '0.3px',
          padding: `${theme.spacing(1.875, 3)}`,
          '&:hover': {
            backgroundColor: theme.palette.primary.main
          },
          '& .MuiButton-startIcon': {
            marginLeft: '-8px'
          },
          '& .MuiButton-endIcon': {
            marginLeft: '6px',
            marginRight: '-18px'
          }
        },
        contained: {
          boxShadow: 'none',
          backgroundColor: theme.palette.primary.main,
          padding: `${theme.spacing(1.875, 5.5)}`
        },
        outlined: {
          padding: `${theme.spacing(1.625, 5.25)}`
        },
        text: {
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover}`
          }
        },
        sizeSmall: {
          padding: `${theme.spacing(1, 2.25)}`,
          '&.MuiButton-contained': {
            padding: '6px 24px 6px 24px',
            height: '32px'
          },
          '&.MuiButton-secondary': {
            padding: '6px 24px 6px 24px',
            height: '32px'
          },
          '&.MuiButton-outlined': {
            padding: '6px 24px 6px 24px',
            height: '32px'
          }
        },
        sizeLarge: {
          padding: `${theme.spacing(2.125, 5.5)}`,
          '&.MuiButton-contained': {
            padding: `${theme.spacing(2.125, 6.5)}`
          },
          '&.MuiButton-outlined': {
            padding: `${theme.spacing(1.875, 6.25)}`
          }
        }
      },
      variants: [
        {
          props: { variant: 'secondary' },
          style: {
            textTransform: 'none',
            backgroundColor: `rgba(2, 108, 143, 0.08)`
          }
        }
      ]
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: 6,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }
      }
    }
  };
};

export default Button;
