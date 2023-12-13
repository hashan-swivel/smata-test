import React from 'react';
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material';
import { sharedClasses } from '@/utils/shared-classes';
import { BillableIcon, CalendarIcon, FlagIcon, KebabMenuIcon } from '@/core/icons';
import { TextWithIconRow } from '@/components/molecules';

export const TabRequestPanel = () => {
  return (
    <Box
      sx={{
        maxWidth: '832px',
        width: '100%',
        border: (theme) => `1px solid ${theme.palette.grey[200]}`,
        borderRadius: '2px',
        backgroundColor: 'white' //added for view purpose
      }}
    >
      <Box
        sx={{
          ...sharedClasses.flexAlignItemsCenter,
          padding: '16px'
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar src='logo.png' />
          <Box>
            <Typography variant='subtitle1'>Sydney Clothes Lines & Letterboxes</Typography>
            <Typography variant='caption'>Quote requested</Typography>
          </Box>
        </Box>
        <Divider
          orientation='vertical'
          sx={{
            height: '56px',
            width: '0px',
            borderWidth: '0px 1px 0px 0px ',
            margin: 0
          }}
        />
        <Box sx={{ flexGrow: 1, marginLeft: '20px' }}>
          <Box sx={sharedClasses.flexRowBetween}>
            <Typography variant='subtitle1' gutterBottom>
              Sydney Clothes Lines & Letterboxes
            </Typography>
            <IconButton aria-label='more'>
              <KebabMenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ ...sharedClasses.flexAlignItemsCenter, gap: '8px' }}>
            <TextWithIconRow
              text={'800.0'}
              variant={'body1'}
              icon={<BillableIcon />}
              iconPosition={'start'}
            />
            <TextWithIconRow
              text={'1 week'}
              variant={'body1'}
              icon={<CalendarIcon />}
              iconPosition={'start'}
            />
            <TextWithIconRow
              text={'2 days'}
              variant={'body1'}
              icon={<FlagIcon />}
              iconPosition={'start'}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
