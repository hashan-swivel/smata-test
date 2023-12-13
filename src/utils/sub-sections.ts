import { NavDrawerSubSections } from '@/types';

const financeSubsections: NavDrawerSubSections = [
  {
    name: 'Invoices',
    path: 'invoices',
    action: () => {
      //add invoice model popup
    }
  },
  { name: 'Levies', path: 'levies' },
  { name: 'Reports', path: 'reports' }
];

export { financeSubsections };
