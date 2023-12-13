import type { ReactElement } from 'react';

import { Box, Typography } from '@mui/material';

import { MainLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/types';

const Page: NextPageWithLayout = () => {
  return (
    <Box padding='36px 52px'>
      <Typography variant='h3'>Hello SMATA !</Typography>
    </Box>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
