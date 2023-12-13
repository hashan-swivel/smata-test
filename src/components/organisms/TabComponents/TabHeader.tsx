import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { sharedClasses } from '@/utils/shared-classes';
import { ArrowUpRightIcon, TimeIcon } from '@/core/icons';
import { KebabButton } from '@/components/atoms';
import { TextWithIconRow } from '@/components/molecules';

export const TabHeader = () => {
  return (
    <Box>
      <Box
        sx={{
          ...sharedClasses.flexRowBetween,
          maxWidth: '826px',
          width: '100%'
        }}
      >
        <Typography variant='h4'>ID 12345 – Quote request</Typography>
        <Box>
          <Button
            endIcon={<ArrowUpRightIcon />}
            size='small'
            variant='contained'
            sx={{
              backgroundColor: (theme) => theme.palette.primary.light,
              color: (theme) => theme.palette.grey['900'],
              marginRight: '12px'
            }}
          >
            My Button
          </Button>
          <KebabButton />
        </Box>
      </Box>
      <TextWithIconRow
        text={'Last update 25/11/21, 16:28'}
        variant={'body2'}
        icon={<TimeIcon />}
        iconPosition={'start'}
        typographySx={{
          color: (theme) => theme.palette.grey['700']
        }}
      />
    </Box>
  );
};
