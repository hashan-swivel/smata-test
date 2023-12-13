import { MainLayout } from '@/components/layout/MainLayout';
import { ReactNode } from 'react';

const Billing = () => {
  return <div>Billing</div>;
};

Billing.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Billing;
