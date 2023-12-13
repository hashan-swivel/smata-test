import { Theme, ThemeOptions } from '@mui/material/styles';
import { TypographyStyleOptions } from '@mui/material/styles/createTypography';

const Typography = (
  theme: Theme,
  fontFamily?: TypographyStyleOptions['fontFamily']
): ThemeOptions['typography'] => {
  return {
    h1: {
      fontSize: 40,
      lineHeight: 1.2,
      fontWeight: 600,
      color: theme.palette.text.primary,
      fontFamily
    },
    h2: {
      fontSize: 32,
      lineHeight: 1.25,
      fontWeight: 600,
      color: theme.palette.text.primary,
      fontFamily
    },
    h3: {
      fontSize: 26,
      lineHeight: '36px',
      fontWeight: 600,
      letterSpacing: 0,
      color: theme.palette.text.primary,
      fontFamily
    },
    h4: {
      fontSize: 22,
      lineHeight: '32px',
      fontWeight: 600,
      color: theme.palette.text.primary,
      fontFamily
    },
    subtitle1: {
      fontSize: 16,
      color: theme.palette.text.primary
    },
    subtitle2: {
      fontSize: 16,
      color: theme.palette.text.secondary
    },
    body1: {
      fontSize: 14,
      fontWeight: 500,
      color: theme.palette.text.primary
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.5,
      color: theme.palette.text.primary
    },
    button: {
      fontSize: 14,
      color: theme.palette.text.primary
    },
    caption: {
      fontSize: 12,
      color: theme.palette.text.secondary
    },
    overline: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.4px',
      lineHeight: '16px',
      textTransform: 'uppercase',
      color: theme.palette.text.primary,
      fontFamily
    }
  };
};

export default Typography;
