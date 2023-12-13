import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const Dashboard = ({ user }) => {
  if (user?.isTenantManager || user?.isSupport) {
    return (
      <div className='navbar-menu-item'>
        <Link
          href={`${user?.baseUrlWithNameSpace}/dashboard`}
          classNameProp='navbar-menu-item-link'
          target='_self'
        >
          <Tooltip arrow title='Dashboard' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-dashboard-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Dashboard</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default Dashboard;
