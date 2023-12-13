// ** MUI Imports
import { Theme, ThemeOptions } from '@mui/material/styles';

const Avatar = (theme: Theme): ThemeOptions['components'] => {
  return {
    MuiAvatarGroup: {
      styleOverrides: {
        root: {
          '.MuiAvatarGroup-avatar': {
            fontSize: '13px',
            width: 32,
            height: 32,
            backgroundColor: 'rgba(177, 224, 232, 1)',
            color: 'rgba(0, 77, 111, 1)'
          }
        }
      }
    }
  };
};

export default Avatar;
