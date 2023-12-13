import { QueryParam } from '@/types/api';

const API_ROUTE = 'documents';

const buildURLwithParams = (searchParams: any) => new URLSearchParams(searchParams);

const getInvoices = (query?: QueryParam<{ is_invoice?: boolean }>) =>
  `/${API_ROUTE}?${buildURLwithParams(query)}`;

export { getInvoices };
