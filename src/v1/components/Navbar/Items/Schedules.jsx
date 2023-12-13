import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';

const Schedules = ({ user }) => {
  if (user?.isTenantManager || user?.isContractor) {
    return (
      <div className='navbar-menu-item'>
        <Link
          classNameProp='navbar-menu-item-link'
          href={`${user?.baseUrlWithNameSpace}/schedules`}
          target='_self'
        >
          <Tooltip arrow title='Schedule' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-schedule-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Schedule</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default Schedules;
