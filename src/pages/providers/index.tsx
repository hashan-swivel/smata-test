import { MainLayout } from '@/components/layout';
import { ReactNode } from 'react';

const Providers = () => {
  return <div>Providers</div>;
};

Providers.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Providers;
