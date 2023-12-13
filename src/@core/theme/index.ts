import { Inter, Noto_Sans } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

import palette from './palette';
import overrides from './overrides';
import typography from './tyopgraphy';

export const inter = Inter({
  subsets: ['latin']
});

export const natoSans = Noto_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap'
});

// Create a theme instance.
const coreTheme = createTheme({
  palette: palette('light'),
  typography: {
    fontFamily: natoSans.style.fontFamily
  },
  shape: {
    borderRadius: 2
  }
});

const theme = createTheme(coreTheme, {
  components: { ...overrides(coreTheme) },
  typography: { ...typography(coreTheme, inter.style.fontFamily) }
});

export default theme;
