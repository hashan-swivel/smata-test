import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';
import { isFeatureEnabled } from '../../../../utils/userHelpers';

const Messages = ({ unreadMessages, user }) => {
  const spaEnabled = isFeatureEnabled(user, 'spa');
  const messageNavbar = user?.isTenantManager || user?.isStrataMember;

  if ((spaEnabled && messageNavbar) || user?.isBuildingInspector) {
    return (
      <div className='navbar-menu-item'>
        <Link href='/src/pages/v1/messages' classNameProp='navbar-menu-item-link' target='_self'>
          <Tooltip arrow title='Messages' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-comment-white nav-icon' />
          </Tooltip>
          {unreadMessages && unreadMessages !== 0 ? (
            <div className='message-indicator-wrapper'>
              <div className='unread-messages-indicator' />
            </div>
          ) : null}
          <span className='icon-text'>Messages</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default Messages;
