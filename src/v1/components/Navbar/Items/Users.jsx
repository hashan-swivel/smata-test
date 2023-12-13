import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const Users = ({ user }) => {
  const contractorInDropdown = user.isSystemManager;
  const contractorIndex = user.isSystemManager || user.isTenantManager;
  const userIndex = user.isSystemManager || user.isOrganisationAdmin || user.isTenantAdmin;
  const locationContactIndex = user.isSystemManager || user.isOrganisationAdmin;
  const buildingManagerLocationIndex = user.isSystemManager || user.isOrganisationAdmin;
  const organisationIndex = user.isSystemManager || user.isTenantAdmin;
  const tenantIndex = user.isSystemManager;

  const [showDropdown, setShowDropdown] = useState(false);

  // Handle clicking off the dropdown
  useEffect(() => {
    function handleClick({ target }) {
      const { className } = target;

      if (
        className &&
        typeof className === 'string' &&
        !className.includes('nav-bar-users-dropdown')
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

  if (
    (contractorInDropdown && contractorIndex) ||
    userIndex ||
    locationContactIndex ||
    buildingManagerLocationIndex
  ) {
    return (
      <div className='navbar-menu-item'>
        <Tooltip arrow title='Users' position='bottom' animation='fade' theme='light'>
          <span className='icon icon-contact-white nav-icon' />
        </Tooltip>
        <span className='icon-text'>Users</span>
        <div
          className={`icon icon-chevron-down-white nav-bar-users-dropdown navbar-options-icon ${
            showDropdown ? 'active' : 'inactive'
          }`}
          role='presentation'
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div
            className={`navbar-options-dropdown navbar-user-options-dropdown ${
              showDropdown ? 'active' : 'inactive'
            }`}
          >
            {contractorInDropdown && contractorIndex && (
              <Link href={`${user?.baseUrlWithNameSpace}/contractors`} target='_self'>
                Contractors
              </Link>
            )}
            {userIndex && (
              <Link href={`${user?.baseUrlWithNameSpace}/users`} target='_self'>
                Users
              </Link>
            )}
            {locationContactIndex && (
              <Link href={`${user?.baseUrlWithNameSpace}/contacts`} target='_self'>
                Contacts
              </Link>
            )}
            {buildingManagerLocationIndex && (
              <Link href={`${user?.baseUrlWithNameSpace}/building_managers`} target='_self'>
                Building Managers
              </Link>
            )}
            {organisationIndex && (
              <Link href={`${user?.baseUrl}/organisations`} target='_self'>
                Organisations
              </Link>
            )}
            {tenantIndex && (
              <Link href={`${user?.baseUrl}/tenants`} target='_self'>
                Tenants
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Users;
