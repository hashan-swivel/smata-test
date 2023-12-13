import React from 'react';

import { Avatar, Button, SxProps, Theme } from '@mui/material';

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
  src: string;
};

export const AvatarButton = ({ onClick, sx, src }: Props) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        minWidth: 'auto',
        padding: 0,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent'
        },
        ...sx
      }}
    >
      <Avatar src={src} />
    </Button>
  );
};
