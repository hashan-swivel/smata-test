import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const Reports = ({ user }) => {
  const reportIndex = user;
  const reportInNav = user?.isOrganisationAdmin;

  if (reportIndex && reportInNav) {
    return (
      <div className='navbar-menu-item'>
        <Link
          href={`${user?.baseUrlWithNameSpace}/reports`}
          classNameProp='navbar-menu-item-link'
          target='_self'
        >
          <Tooltip arrow title='Report' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-reports-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Reports</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default Reports;
