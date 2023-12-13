import { FilterComponent } from '@/components/molecules';
import { MainLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/types';
import { Box } from '@mui/material';
import Head from 'next/head';
import type { ReactElement } from 'react';
import { financeSubsections } from '../../../utils/sub-sections';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Reports</title>
      </Head>
      <Box padding='36px 52px'>Reports</Box>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout
      filterComponent={<FilterComponent sectionHeader='Finance' subSections={financeSubsections} />}
    >
      {page}
    </MainLayout>
  );
};

export default Page;
