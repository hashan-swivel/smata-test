import {
  BillableIcon,
  BuildingsIcon,
  DocumentIcon,
  FinanceIcon,
  HomeIcon,
  JobIcon,
  ProviderIcon
} from '@/@core/icons';
import {
  BILLING_ROUTE,
  BUILDINGS_ROUTE,
  DOCUMENTS_ROUTE,
  FINANCE_ROUTE,
  HOME_ROUTE,
  JOBS_ROUTE,
  PROVIDERS_ROUTE
} from '@/constants/routes';

export const navRailMenuItems = [
  {
    label: 'Home',
    icon: <HomeIcon />,
    route: HOME_ROUTE
  },
  {
    label: 'Buildings',
    icon: <BuildingsIcon width={24} height={24} />,
    route: BUILDINGS_ROUTE
  },
  {
    label: 'Jobs',
    icon: <JobIcon width={24} height={24} />,
    route: JOBS_ROUTE
  },
  {
    label: 'Providers',
    icon: <ProviderIcon width={24} height={24} />,
    route: PROVIDERS_ROUTE
  },
  {
    label: 'Finance',
    icon: <FinanceIcon width={24} height={24} />,
    route: FINANCE_ROUTE
  },
  {
    label: 'Docs',
    icon: <DocumentIcon width={24} height={24} />,
    route: DOCUMENTS_ROUTE
  },
  {
    label: 'Bllling',
    icon: <BillableIcon width={24} height={24} />,
    route: BILLING_ROUTE
  }
];
