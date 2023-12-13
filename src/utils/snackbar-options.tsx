import theme from '@/@core/theme';
import { Button } from '@mui/material';
import { VariantType, enqueueSnackbar } from 'notistack';

export const snackbar = (
  message: string,
  variant: VariantType = 'default',
  preventDuplicate: boolean = false
) =>
  enqueueSnackbar(message, {
    variant,
    preventDuplicate
  });

export const callbackSnackbar = (
  message: string,
  buttonText: string,
  onClick: () => void,
  variant: VariantType = 'default',
  preventDuplicate: boolean = false
) =>
  enqueueSnackbar(message, {
    variant,
    preventDuplicate,
    action: () => (
      <Button
        variant='text'
        onClick={onClick}
        style={{
          color: theme.palette.info.dark
        }}
      >
        {buttonText}
      </Button>
    )
  });
