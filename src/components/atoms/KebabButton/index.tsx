import React from 'react';
import { KebabMenuIcon } from '@/core/icons';
import { Button } from '@mui/material';

export const KebabButton = () => {
  return (
    <Button
      variant='contained'
      aria-label='save'
      sx={{
        borderRadius: 0,
        width: '32px',
        height: '32px',
        minWidth: '32px',
        padding: 0,
        '& .MuiButton-startIcon': {
          margin: 0,
          marginLeft: '-4px'
        },
        '&:hover, &:active, &.active': {
          backgroundColor: (theme) => theme.palette.primary.light
        },
        backgroundColor: (theme) => theme.palette.primary.light
      }}
    >
      <KebabMenuIcon />
    </Button>
  );
};
