import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';

export const makeClasses = <T extends string>(
  styles: Record<T, SxProps<Theme>>
): Record<T, SxProps<Theme>> => styles;
