import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';
import { isFeatureEnabled } from '../../../../utils/userHelpers';

const Zoom = ({ user }) => {
  const zoomIntegration =
    user?.isSystemManager || (isFeatureEnabled(user, 'zoom') && user?.isTenantManager);

  if (zoomIntegration) {
    return (
      <div className='navbar-menu-item'>
        <Link
          href={`${user?.baseUrl}/zoom/meetings`}
          classNameProp='navbar-menu-item-link'
          target='_self'
        >
          <Tooltip
            arrow
            title='Zoom Calls & Meetings'
            position='bottom'
            animation='fade'
            theme='light'
          >
            <span className='icon icon-video-camera-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Zoom Calls & Meetings</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default Zoom;
