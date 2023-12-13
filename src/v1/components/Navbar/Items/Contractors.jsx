import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const Contractors = ({ user }) => {
  const contractorsIndex = user?.isSystemManager || user?.isTenantManager;
  const contractorsInNav = !user?.isSystemManager;

  if (contractorsIndex && contractorsInNav) {
    return (
      <div className='navbar-menu-item'>
        <Link
          classNameProp='navbar-menu-item-link'
          href={`${user?.baseUrlWithNameSpace}/contractors`}
          target='_self'
        >
          <Tooltip arrow title='Contractors' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-creditor-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Contractors</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default Contractors;
