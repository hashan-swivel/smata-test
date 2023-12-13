import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { QuestionOutlineIcon, SuccessPoll } from '@/core/icons';
import { DUMMY_TEXT_TABS, TabNames } from '@/constants';
import {
  TabAlert,
  TabDescription,
  TabDetailPanel,
  TabPanel,
  TabRequestPanel,
  TextWithIconRow
} from '@/components/molecules';
import { TabHeader } from './TabHeader';

export const TabComponents = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[50],
        maxWidth: '912px',
        width: '100%',
        position: 'relative', // can remove those added for view purposes
        margin: '100px 40px',
        padding: '40px'
      }}
    >
      <Box>
        <TabHeader />
        <Tabs value={value} onChange={handleChange} aria-label='work request tabs'>
          <Tab
            sx={{
              padding: '4px'
            }}
            label={TabNames.WorkRequest}
          />
          <Tab
            sx={{
              padding: '4px'
            }}
            label={TabNames.Details}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TabAlert
          sx={{
            mt: 2,
            mb: 2
          }}
          sxTitle={{
            color: '#191C1E' // TODO: need to move this to palette
          }}
          title={'Share your experience with provider and other users!'}
          titleIcon={<SuccessPoll />}
          titleCornerBtnText={'view info'}
          buttonTitle={'hey there'}
          messageVariant={'body2'}
          severity={'warning'}
          message={'Home Building Contract needed (quote is over $5,000)'}
        />
        <TextWithIconRow
          text={'Quote requests (1/2 received, min – 2)'}
          variant={'body1'}
          icon={<QuestionOutlineIcon />}
          iconPosition={'end'}
          typographySx={{
            color: (theme) => theme.palette.grey['500']
          }}
          sx={{
            marginBottom: '8px'
          }}
        />
        <TabRequestPanel />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TabDetailPanel title={'type'} description={'Machinery Breakdown'} />
        <TabDescription
          sx={{
            mt: 2
          }}
          title={'Description'}
          description={DUMMY_TEXT_TABS}
          buttonTitle={'Requirements'}
          buttonText={'5 Requirements'}
        />
      </TabPanel>
    </Box>
  );
};
