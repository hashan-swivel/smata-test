import { MainLayout } from '@/components/layout';
import { ReactNode } from 'react';

const Custom404Page = () => {
  return <div>Page Not Found</div>;
};

Custom404Page.getLayout = function getLayout(page: ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};

export default Custom404Page;
