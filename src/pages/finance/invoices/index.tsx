import { MainLayout } from '@/components/layout';
import { NextPageWithLayout } from '@/types';
import { Box } from '@mui/material';
import type { ReactElement } from 'react';
import { FilterComponent } from '@/components/molecules';
import { financeSubsections } from '../../../utils/sub-sections';
import Head from 'next/head';
import { InvoiceListFilters } from '@/components/templates';

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Invoices</title>
      </Head>
      <Box padding='36px 52px'>{/* <InvoicesListView /> */}</Box>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout
      filterComponent={
        <FilterComponent
          sectionHeader='Finance'
          subSections={financeSubsections}
          filters={<InvoiceListFilters />}
        />
      }
    >
      {page}
    </MainLayout>
  );
};

export default Page;
