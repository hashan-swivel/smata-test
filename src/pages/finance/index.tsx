/* eslint-disable react/jsx-no-useless-fragment */
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { financeSubsections } from '../../utils/sub-sections';

export default function FinancePage() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    router.push(pathname + `/${financeSubsections[0].path}`);
  }, [pathname, router]);

  return <></>;
}
