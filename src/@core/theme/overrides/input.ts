// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const input = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.primary}, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.primary}, 0.32)`
          },
          '&.Mui-disabled:before': {
            borderBottom: `1px solid ${theme.palette.text.disabled}`
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          paddingTop: 14,
          paddingBottom: 14,
          paddingLeft: 16,
          backgroundColor: `rgba(2, 108, 143, 0.08)`,
          '& .MuiFilledInput-input': {
            padding: 0,
            lineHeight: '20px',
            height: 'auto'
          },
          // backgroundColor: `rgba(${theme.palette.primary}, 0.12)`,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: `rgba(${theme.palette.primary}, 0.08)`
          },
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.primary}, 0.22)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.primary}, 0.32)`
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(${theme.palette.primary}, 0.32)`
          },
          '&:hover.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: `rgba(${theme.palette.primary}, 0.22)`
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.disabled
          }
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '&.MuiInputAdornment-root:not(.MuiInputAdornment-hiddenLabel)': {
            marginTop: '0 !important'
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root .MuiFilledInput-input': { padding: 0 },
          '& .MuiAutocomplete-inputRoot[class*="MuiFilledInput-root"]': {
            padding: '14px 16px'
          }
        }
      }
    }
  };
};

export default input;
