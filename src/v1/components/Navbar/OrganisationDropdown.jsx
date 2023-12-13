import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { organisationUserActions } from '../../../actions';
import { Loading } from '../Loading';

import './OrganisationDropdown.module.scss';

const OrganisationDropdown = ({ user, organisationUsers, organisationUsersLoading, dispatch }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (showDropdown) dispatch(organisationUserActions.getOrganisationUsers());
  }, [showDropdown]);

  const handleItemClick = async (item) => {
    setShowDropdown(!showDropdown);

    if (item.organisation_id !== user.organisation_id) {
      dispatch(organisationUserActions.updateOrganisationUser(item.id));
    }
  };

  // Handle clicking off the dropdown
  useEffect(() => {
    function handleClick({ target }) {
      const { className } = target;

      if (
        className &&
        typeof className === 'string' &&
        !className.includes('organizations-dropdown')
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

  const organisationUserList = () => {
    return organisationUsers.map((item) => (
      <li
        title={item.name}
        onClick={() => handleItemClick(item)}
        key={item.id}
        className={
          item?.logo_url ? 'organisations-dropdown-option' : 'organisations-dropdown-option'
        }
        style={{ backgroundColor: item?.colour_web_general || '#FFFFFF' }}
      >
        <div className={item?.logo_url ? '' : 'light'}>
          {item?.logo_url && <img src={item?.logo_url} alt={item?.name} />}
        </div>
      </li>
    ));
  };

  return (
    <div
      className={`icon icon-chevron-down-white organizations-dropdown navbar-options-icon ${
        showDropdown ? 'active' : 'inactive'
      }`}
      role='presentation'
      onClick={() => setShowDropdown(!showDropdown)}
    >
      <ul
        className={`navbar-options-dropdown organisations-dropdown-menu ${
          showDropdown ? 'active' : 'inactive'
        }`}
      >
        {organisationUsersLoading ? (
          <Loading fill='#000000' componentLoad />
        ) : (
          organisationUserList()
        )}
      </ul>
    </div>
  );
};

export default connect((state) => state.organisationUsers)(OrganisationDropdown);
