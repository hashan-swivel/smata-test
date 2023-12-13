import { MainLayout } from '@/components/layout/MainLayout';
import { ReactNode } from 'react';

const Jobs = () => {
  return <div>Jobs</div>;
};

Jobs.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Jobs;
