import React, { ReactElement } from 'react';
import { Box, SxProps, Theme, Typography, TypographyProps } from '@mui/material';

type Props = {
  text: string;
  variant: TypographyProps['variant'];
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  typographySx?: SxProps<Theme>;
  sx?: SxProps<Theme>;
};
export const TextWithIconRow = ({
  text,
  variant,
  iconPosition,
  icon,
  typographySx,
  sx
}: Props): ReactElement => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', ...sx }}>
      {iconPosition === 'start' && icon}
      <Typography variant={variant} sx={typographySx}>
        {text}
      </Typography>
      {iconPosition === 'end' && icon}
    </Box>
  );
};
