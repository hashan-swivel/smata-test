import React, { useState, useEffect } from 'react';
import { Link } from '../../Link';
import { Avatar } from '../../Avatar';

const CurrentAccount = ({ user, handleLogout }) => {
  const nameSpace = user?.namespace || '';
  const [showDropdown, setShowDropdown] = useState(false);
  const reportIndex = user;
  const reportInDropdown = user?.isSystemManager;
  const reviewIndex = user?.isAdmin;
  const settingRails = user && !user?.isStrataMember;
  const settingReact = user?.isStrataMember;
  const invoiceEmails = user?.isSystemManager || user?.isOrganisationAdmin;
  const organisationPortalSetting =
    user?.isSystemManager || user?.isOrganisationAdmin || user?.isStrataManager;
  const documentImport = user?.isOrganisationAdmin;
  const organisationBilling = user?.isSystemManager || user?.isOrganisationAdmin;
  const buildingInspectionBilling = user?.isBuildingInspector;
  const complianceSettings = user?.isSystemManager;
  const digitalNoticeboardScreen =
    user?.isSystemManager ||
    ((user?.isOrganisationAdmin || user?.isStrataManager) &&
      user?.feature_flags?.digital_noticeboard);

  let settingHref;
  if (settingRails) settingHref = `${user.baseUrl}/user/settings/edit`;
  if (settingReact) settingHref = '/settings';

  // Handle clicking off the dropdown
  useEffect(() => {
    function handleClick({ target }) {
      const { className } = target;

      if (
        className &&
        typeof className === 'string' &&
        !className.includes('current-account-dropdown')
      ) {
        return setShowDropdown(false);
      }
    }

    if (showDropdown) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [showDropdown]);

  // Escape key when dropdown is open closes it
  useEffect(() => {
    function handleKeydown({ keyCode }) {
      if (keyCode === 27) setShowDropdown(false);
    }

    if (showDropdown) {
      document.addEventListener('keydown', handleKeydown);
      return () => document.removeEventListener('keydown', handleKeydown);
    }
  }, [showDropdown]);

  return (
    <>
      <div className='navbar-menu-item username-container'>
        <Avatar {...user} size='xsmall' showTooltip />

        <div
          className={`icon icon-chevron-down-white current-account-dropdown navbar-options-icon ${
            showDropdown ? 'active' : 'inactive'
          }`}
          role='presentation'
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className={`navbar-options-dropdown ${showDropdown ? 'active' : 'inactive'}`}>
            {organisationBilling && (
              <Link href={`${user.baseUrl}/organisation_payments`} target='_self'>
                Billing
              </Link>
            )}
            {buildingInspectionBilling && (
              <Link
                href={`${user.baseUrl}/building_inspector/organisation_payments`}
                target='_self'
              >
                Billing
              </Link>
            )}
            {reportIndex && reportInDropdown && (
              <Link href={`${user.baseUrlWithNameSpace}/reports`} target='_self'>
                Reports
              </Link>
            )}
            {reviewIndex && (
              <Link href={`${user.baseUrlWithNameSpace}/reviews`} target='_self'>
                Internal Reviews
              </Link>
            )}
            {reviewIndex && (
              <Link href={`${user.baseUrlWithNameSpace}/reviews?contacts=true`} target='_self'>
                Contractor Reviews
              </Link>
            )}
            {complianceSettings && (
              <Link href={`${user.baseUrlWithNameSpace}/compliance`} target='_self'>
                Compliance
              </Link>
            )}
            <Link href={settingHref} target='_self'>
              Settings
            </Link>
            {invoiceEmails && (
              <Link href={`${user.baseUrl}/invoice_emails`} target='_self'>
                Invoice Processing
              </Link>
            )}
            {organisationPortalSetting && (
              <Link href={`${user.baseUrl}/organisation_portal_settings`} target='_self'>
                Permissions
              </Link>
            )}
            {documentImport && (
              <Link href='/v1/documents/import' target='_self'>
                Document Import
              </Link>
            )}
            {digitalNoticeboardScreen && (
              <Link href={`${user.baseUrl}/digital_noticeboard_screens`} target='_self'>
                Digital Noticeboard Screens
              </Link>
            )}
            <Link href='#' target='_self' onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentAccount;
