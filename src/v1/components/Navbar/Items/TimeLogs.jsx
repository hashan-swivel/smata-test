import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const TimeLogs = ({ user }) => {
  const timeLogIndex = user?.isSystemManager || user?.isStrataManager || user?.isOrganisationAdmin;

  if (timeLogIndex) {
    return (
      <div className='navbar-menu-item'>
        <Link
          href={`${user?.baseUrl}/time_logs`}
          classNameProp='navbar-menu-item-link'
          target='_self'
        >
          <Tooltip arrow title='Time & Charges' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-dollar-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Time & Charges</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default TimeLogs;
