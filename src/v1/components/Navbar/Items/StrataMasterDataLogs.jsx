import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const StrataMasterDataLogs = ({ user }) => {
  const strataMasterDataLogNavbar = user?.isAdmin;

  if (strataMasterDataLogNavbar) {
    return (
      <div className='navbar-menu-item'>
        <Link
          href='/src/pages/v1/strata-master-data-logs'
          classNameProp='navbar-menu-item-link'
          target='_self'
        >
          <Tooltip
            arrow
            title='Strata Master Data Logs'
            position='bottom'
            animation='fade'
            theme='light'
          >
            <span className='icon icon-strata-manager-logs-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Strata Master Data Logs</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default StrataMasterDataLogs;
