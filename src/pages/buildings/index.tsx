import { MainLayout } from '@/components/layout';
import { ReactNode } from 'react';

const Buildings = () => {
  return <div>buildings</div>;
};

Buildings.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Buildings;
