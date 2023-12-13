import { userConstants } from '../constants';
import { colors } from './helpers';
import { baseBackendURL } from './urlHelpers';

export const isFeatureEnabled = (user, featureName) =>
  user.feature_flags && user.feature_flags[featureName] === true;

export const userFullName = (firstName, lastName) =>
  [firstName?.trim(), lastName?.trim()].filter((e) => e !== null && e !== '').join(' ');

export const userDecorator = (user) => {
  // isStrataMember, isStrataManager, isOrganisationAdmin, isAdmin, isSupport...
  if (user.role) {
    Object.values(userConstants.ROLES).forEach((role) => {
      const attrName = `is_${role}`
        .toLowerCase()
        .replace(/(_|-)([a-z])/g, (g) => g[1].toUpperCase());
      user[attrName] = user.role === role;
    });

    user.isSystemManager = user.isAdmin || user.isSupport;
    user.isTenantMananger =
      user.isStrataManager || user.isOrganisationAdmin || user.isBuildingManager; // TODO: Remove
    user.isTenantManager =
      user.isStrataManager || user.isOrganisationAdmin || user.isBuildingManager;
  }

  // canDeleteDocument, canViewAllDocument, canDeleteInvoice, canViewAllInvoice, canManageEmailExtractionInvoice, canOverrideInvoice
  userConstants.DOCUMENT_PERMISSIONS.forEach((permissionName) => {
    const [type, action] = permissionName.split('.');

    const attrName = `can_${action}_${type}`
      .toLowerCase()
      .replace(/(_|-)([a-z])/g, (g) => g[1].toUpperCase());
    user[attrName] = user?.document_permissions?.[permissionName] || false;
  });

  if (user?.current_enabled_subdomain !== null && user?.current_enabled_subdomain !== undefined) {
    const { protocol, host } = new URL(baseBackendURL);
    user.baseUrl = `${protocol}//${user?.current_enabled_subdomain}.${host}`;
  } else {
    user.baseUrl = baseBackendURL;
  }

  user.baseUrlWithNameSpace = user?.namespace ? `${user.baseUrl}/${user?.namespace}` : user.baseUrl;

  return user;
};

// https://codepen.io/peterbartha/pen/BKxGPK
export const calculateAvatarColor = (name, defaultBg) => {
  if (defaultBg) return '#4FCBB2';
  let hash = 0;
  if (name.length === 0) return hash;
  // eslint-disable-next-line
  for (let i = 0; i < name.length; i++) {
    // eslint-disable-next-line
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    // eslint-disable-next-line
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;
  return colors[hash];
};
