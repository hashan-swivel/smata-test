'use client';
import * as React from 'react';
import { Backdrop, Box, LinearProgress } from '@mui/material';

export function TableLoading() {
  return (
    <Box width={'100%'} position='absolute' top={0} left={0} height={'100%'}>
      <Backdrop
        sx={{
          backgroundColor: 'rgb(255,255,255,0.5)',
          position: 'absolute',
          width: '100%',
          top: 30
        }}
        open={true}
      ></Backdrop>
      <Box
        sx={{
          width: '100%',
          position: 'absolute',
          top: 30,
          left: 0,
          borderTop: (theme) => `1px solid ${theme.palette.grey[900]}`
        }}
      >
        <LinearProgress />
      </Box>
    </Box>
  );
}
