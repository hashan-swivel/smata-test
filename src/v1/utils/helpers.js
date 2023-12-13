export const colors = [
  '#e57373',
  '#ef5350',
  '#f44336',
  '#F06292',
  '#EC407A',
  '#E91E63',
  '#BA68C8',
  '#AB47BC',
  '#9C27B0',
  '#9575CD',
  '#7E57C2',
  '#673AB7',
  '#7986CB',
  '#5C6BC0',
  '#3F51B5',
  '#64B5F6',
  '#42A5F5',
  '#2196F3',
  '#29B6F6',
  '#03A9F4',
  '#4DD0E1',
  '#00BCD4',
  '#4DB6AC',
  '#26A69A',
  '#009688',
  '#81C784',
  '#66BB6A',
  '#4CAF50',
  '#9CCC65',
  '#8BC34A',
  '#D4E157',
  '#CDDC39',
  '#C0CA33',
  '#FFEB3B',
  '#FDD835',
  '#FBC02D',
  '#FFC107',
  '#FFB300',
  '#FFA000'
];

export const searchOptions = {
  financial_reports: {
    titles: {
      documents: 'Report name',
      search: 'Search',
      sp_number: 'Plan Number'
    },
    icons: {
      documents: 'document-dark',
      search: 'search-dark',
      sp_number: 'document-dark'
    }
  },
  documents: {
    titles: {
      documents: 'Document name',
      invoices: 'Invoice name',
      invoice_number: 'Invoice number',
      invoice_status: 'Invoice status',
      type: 'Type',
      tag: 'Tag',
      amounts: 'Amount',
      contractor: 'Contractor',
      search: 'Search',
      sp_number: 'Plan Number',
      lot_number: 'Lot Number',
      images: 'Images',
      user_name: 'Action user'
    },
    icons: {
      documents: 'document-dark',
      invoices: 'document-dark',
      invoice_number: 'document-dark',
      type: 'folder-dark',
      tag: 'tags-dark',
      amounts: 'dollar-dark',
      contractor: 'user-dark',
      search: 'search-dark',
      sp_number: 'document-dark',
      lot_number: 'document-dark',
      images: 'camera-dark'
    }
  },
  messages: {
    titles: {
      messages: 'Messages',
      chat_rooms: 'Chats',
      building_addresses: 'Building Addresses',
      documents: 'Documents',
      contacts: 'Contacts',
      site_plan_ids: 'Plan Number',
      search: 'Search'
    },
    icons: {
      messages: 'comment-dark',
      chat_rooms: 'comment-dark',
      building_addresses: 'building-dark',
      documents: 'document-dark',
      contacts: 'user-dark',
      site_plan_ids: 'document-dark',
      search: 'search-dark'
    }
  }
};

export const formatUserLabel = (role) => {
  switch (role) {
    case 'strata_manager':
      return 'Strata Manager';
    case 'strata_member':
      return 'Strata Member';
    case 'committee_member':
      return 'Committee Member';
    case 'building_manager':
      return 'Building Manager';
    default:
      return 'Association';
  }
};

export const hasRole =
  (...roles) =>
  (user) =>
    roles.includes(user?.role);
export const hasSubRole =
  (...roles) =>
  (user) =>
    user?.subroles.filter((item) => roles.includes(item.role)).length > 0;

// TODO: replace with user attribute in Redux
export const isAdmin = hasRole('admin');
export const isSupport = hasRole('support');
export const isAdminOrSupport = hasRole('admin', 'support');
export const isManager = hasRole('strata_manager', 'building_manager', 'organisation_admin');
export const isStrataManager = hasRole('strata_manager');
export const isBuildingManager = hasRole('building_manager');
export const isOrganisationAdmin = hasRole('organisation_admin');
export const isCommitteeMember = hasRole('committee_member');
export const isContractor = hasRole('contractor');
export const isMember = hasRole('strata_member');
export const isOwner = hasRole('owner_landlord', 'owner_occupier');
export const isOwnerSubRole = hasSubRole(
  'owner',
  'committee_member',
  'owner_landlord',
  'owner_occupier'
);

export const calcRatings = (ratings) => {
  const { length } = ratings;
  if (!length) return 0;
  let sum = 0;
  ratings.forEach((rating) => {
    sum += rating.vote;
  });
  return (sum / length).toFixed(1);
};
