import React from 'react';
import { sharedClasses } from '@/utils/shared-classes';
import { Box, Button, Typography, TypographyProps } from '@mui/material';

type Props = {
  message?: string;
  msgVariant?: TypographyProps['variant'];
  bodyBtnMsg?: string;
  rightEndMsg?: string;
};

export const TabAlertBody = ({ message, msgVariant, bodyBtnMsg, rightEndMsg }: Props) => {
  return (
    <Box sx={{ ...sharedClasses.flexAlignItemsCenter, gap: '34px' }}>
      <Typography variant={msgVariant}>{message}</Typography>
      <Box>
        <Box sx={sharedClasses.flexRowBetween}>
          <Button color='secondary' sx={{ padding: 0 }}>
            {bodyBtnMsg}
          </Button>
        </Box>
        {/*TODO: need to map with real data */}
        {/*<Box sx={{ ...sharedClasses.flexAlignItemsCenter, gap: '24px', marginTop: '4px' }}>*/}
        {/*  <TextWithIconRow*/}
        {/*    text={'800.0'}*/}
        {/*    variant={'body1'}*/}
        {/*    icon={<BillableIcon />}*/}
        {/*    iconPosition={'start'}*/}
        {/*  />*/}
        {/*</Box>*/}
      </Box>
      <Typography variant={msgVariant} sx={{ marginLeft: '64px' }}>
        {rightEndMsg}
      </Typography>
    </Box>
  );
};
