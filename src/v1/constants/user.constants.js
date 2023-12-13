export const userConstants = {
  ACTIVE_STATES: ['active'],
  NOTIFIABLE_STATES: ['active', 'invited', 'imported'],
  ORG_MANAGER_ROLES: ['organisation_admin', 'strata_manager'],
  TENANT_MANAGER_ROLES: ['organisation_admin', 'strata_manager', 'building_manager'],
  SYSTEM_MANAGER_ROLES: ['admin', 'support'],
  ROLES: {
    ADMIN: 'admin',
    CONTRACTOR: 'contractor',
    BUILDING_MANAGER: 'building_manager',
    ORGANISATION_ADMIN: 'organisation_admin',
    STRATA_MANAGER: 'strata_manager',
    STRATA_MEMBER: 'strata_member',
    SUPPORT: 'support',
    BUILDING_INSPECTOR: 'building_inspector'
  },
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_MIN_LENGTH: 8,
  DOCUMENT_PERMISSIONS: [
    'document.delete',
    'document.view_all',
    'invoice.delete',
    'invoice.manage_email_extraction',
    'invoice.override',
    'invoice.view_all'
  ],
  BUILDING_PROFILE_PERMISSIONS: [
    'create_work_request',
    'generate_financial_report',
    'message',
    'view_building_directory',
    'view_building_rule',
    'view_recent_works',
    'view_star_rating',
    'view_upcoming_works',
    'view_levy_notices'
  ]
};
