import { Color } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    branding: Partial<Color>;
    lime: Partial<Color>;
    status: {
      [key: string]: {
        bg: string;
        text: string;
      };
    };
  }
  interface PaletteOptions {
    branding: Partial<Color>;
    lime: Partial<Color>;
    status: {
      [key: string]: {
        bg: string;
        text: string;
      };
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    secondary: true;
  }
}

export {};
