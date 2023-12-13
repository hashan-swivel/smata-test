import React from 'react';
import { Tooltip } from 'react-tippy';
import { isFeatureEnabled } from '../../../../utils/userHelpers';

const Buildings = ({ user }) => {
  const spaEnabled = isFeatureEnabled(user, 'spa');
  const locationIndex = user?.isSystemManager || user?.isTenantManager;
  const buildingProfile = (user?.isStrataMember && spaEnabled) || user?.isBuildingInspector;

  let href;

  if (buildingProfile) {
    href = `/building-profile?id=${encodeURIComponent(user.default_building_profile_id) || 'null'}`;
  }

  if (locationIndex) {
    href = `${user?.baseUrlWithNameSpace}/locations`;
  }

  if (!href) return null;

  return (
    <div className='navbar-menu-item'>
      <a href={href} className='navbar-menu-item-link' target='_self'>
        <Tooltip arrow title='Buildings' position='bottom' animation='fade' theme='light'>
          <span className='icon icon-smata-building-white nav-icon' />
        </Tooltip>
        <span className='icon-text'>Buildings</span>
      </a>
    </div>
  );
};

export default Buildings;
