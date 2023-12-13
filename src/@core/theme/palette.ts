import { PaletteMode, PaletteOptions } from '@mui/material';

const DefaultPalette = (mode: PaletteMode): PaletteOptions => {
  // RGB
  const lightColor = '0, 77, 111';
  const darkColor = '231, 227, 252';

  // Branding / lightblue
  const lightBlue = {
    50: '#E0F3F5',
    100: '#B1E0E8',
    200: '#81CCDA',
    300: '#57B7CD',
    400: '#3AA9C6',
    500: '#1E9BC0',
    600: '#138EB3',
    700: '#007DA2',
    800: '#007DA2',
    900: '#004D6F', // primary
    A100: '#84F5FF',
    A200: '#18F0FF',
    A400: '#00E6FF',
    A700: '#00B8D4'
  };

  const mainColor = mode === 'light' ? lightColor : darkColor;

  return {
    mode: mode,
    common: {
      black: '#000',
      white: '#FFF'
    },
    branding: lightBlue,
    primary: {
      light: '#026C8F14',
      main: lightBlue[900],
      dark: '#81CCDA',
      contrastText: '#FFF'
    },
    secondary: {
      light: '#9C9FA4',
      main: '#8A8D93',
      dark: '#777B82',
      contrastText: '#FFF'
    },
    success: {
      light: '#6AD01F',
      main: '#56CA00',
      dark: '#4CB200',
      contrastText: '#FFF'
    },
    error: {
      light: '##FFAEAE',
      main: '#DB2424',
      dark: '#E04347',
      contrastText: '#FFF'
    },
    warning: {
      light: '#FFCA64',
      main: '#FFB400',
      dark: '#E09E00',
      contrastText: '#FFF'
    },
    info: {
      light: '#32BAFF',
      main: '#16B1FF',
      dark: '#139CE0',
      contrastText: '#FFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#C5C6C8',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#D5D5D5',
      A200: '#AAAAAA',
      A400: '#616161',
      A700: '#303030'
    },
    lime: {
      50: '#F8FBE6',
      100: '#EDF5C1',
      200: '#E1EF99',
      300: '#D5E96F',
      400: '#CDE34E',
      500: '#C5DF2A',
      600: '#B9CC24',
      700: '#A9B61A',
      800: '#999F10',
      900: '#7F7900',
      A100: '#F4FF81',
      A200: '#EEFF41',
      A400: '#C6FF00',
      A700: '#AEEA00'
    },
    text: {
      primary: '#212121',
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.38)`
    },
    divider: '#C5C6C8',
    background: {
      paper: mode === 'light' ? '#FFF' : '#312D4B',
      default: mode === 'light' ? '#fff' : '#28243D'
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.12)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.3)`,
      disabledBackground: `rgba(${mainColor}, 0.18)`,
      focus: `rgba(${mainColor}, 0.12)`
    },
    status: {
      success: {
        text: '#0D9B70',
        bg: '#10BF8B'
      },
      failed: {
        text: '#DB2424',
        bg: '#F33B3B'
      },
      inprogress: {
        text: '',
        bg: '#188BF4'
      },
      attention: {
        text: '#C68207',
        bg: '#F7A817'
      },
      noaction: {
        text: '#876D6B',
        bg: '#9D817F'
      }
    }
  };
};

export default DefaultPalette;
