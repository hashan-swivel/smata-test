import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const Jobs = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const jobIndex =
    user?.isTenantManager ||
    user?.isContractor ||
    user?.isSystemManager ||
    user?.isBuildingInspector;

  // Handle clicking off the dropdown
  useEffect(() => {
    function handleClick({ target }) {
      const { className } = target;

      if (
        className &&
        typeof className === 'string' &&
        !className.includes('nav-bar-job-dropdown')
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

  if (jobIndex) {
    return (
      <div className='navbar-menu-item'>
        <Link
          classNameProp='navbar-menu-item-link'
          href={
            user?.isTenantManager
              ? `${user?.baseUrlWithNameSpace}/jobs?strata_managers=${user.id}`
              : `${user?.baseUrlWithNameSpace}/jobs`
          }
          target='_self'
        >
          <Tooltip arrow title='Jobs' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-smata-work-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Jobs</span>
        </Link>
        {(user?.isTenantManager || user?.isSupport) && (
          <div
            className={`icon icon-chevron-down-white nav-bar-job-dropdown navbar-options-icon ${
              showDropdown ? 'active' : 'inactive'
            }`}
            role='presentation'
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className={`navbar-options-dropdown ${showDropdown ? 'active' : 'inactive'}`}>
              {user?.isTenantManager && (
                <>
                  <Link
                    href={`${user?.baseUrlWithNameSpace}/jobs?strata_managers=${user.id}`}
                    target='_self'
                  >
                    All
                  </Link>
                  <Link href={`${user?.baseUrlWithNameSpace}/jobs?assisted=true`} target='_self'>
                    Assisted
                  </Link>
                  <Link href={`${user?.baseUrlWithNameSpace}/jobs?assigned=true`} target='_self'>
                    Assigned
                  </Link>
                </>
              )}
              {user?.isSupport && (
                <>
                  <Link href={`${user?.baseUrlWithNameSpace}/jobs`} target='_self'>
                    All
                  </Link>
                  <Link href={`${user?.baseUrlWithNameSpace}/jobs?assigned=true`} target='_self'>
                    Assigned
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Jobs;
