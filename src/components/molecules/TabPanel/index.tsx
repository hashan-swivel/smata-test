import React from 'react';
import { Box, Typography } from '@mui/material';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};
export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box mt={2.5}>
          <Typography
            component='div'
            sx={{
              color: '#004D6F' //  branding values fail in test  need to fix
            }}
          >
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
};
