import { FilterComponent } from '@/components/molecules';
import { MainLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/types';
import { Box } from '@mui/material';
import Head from 'next/head';
import type { ReactElement } from 'react';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Documents</title>
      </Head>
      <Box padding='36px 52px'>{/* Document list component */}</Box>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout filterComponent={<FilterComponent sectionHeader='Documents' />}>{page}</MainLayout>
  );
};

export default Page;
