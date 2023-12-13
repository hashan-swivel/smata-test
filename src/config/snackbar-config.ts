import { SnackbarProviderProps } from 'notistack';
import StyledMaterialDesignContent from '@/@core/components/notistackbar';

export const SnackBarProviderConfig: SnackbarProviderProps = {
  anchorOrigin: {
    horizontal: 'center',
    vertical: 'bottom'
  },
  maxSnack: 4,
  Components: {
    default: StyledMaterialDesignContent,
    error: StyledMaterialDesignContent,
    info: StyledMaterialDesignContent,
    success: StyledMaterialDesignContent,
    warning: StyledMaterialDesignContent
  }
};
