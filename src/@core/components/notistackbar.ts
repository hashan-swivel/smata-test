import { styled } from '@mui/material';
import { MaterialDesignContent } from 'notistack';
import theme, { natoSans } from '../theme';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-success': {
    fontFamily: natoSans.style.fontFamily,
    width: 450
  },
  '&.notistack-MuiContent-error': {
    fontFamily: natoSans.style.fontFamily,
    width: 450
  },
  '&.notistack-MuiContent-default': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontFamily: natoSans.style.fontFamily,
    width: 450
  }
}));

export default StyledMaterialDesignContent;
