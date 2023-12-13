import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';
import { isFeatureEnabled } from '../../../../utils/userHelpers';

const Documents = ({ user }) => {
  const spaEnabled = isFeatureEnabled(user, 'spa');
  const documentNavbar =
    user?.isSystemManager ||
    user?.isBuildingInspector ||
    (spaEnabled && (user?.isTenantManager || user?.isStrataMember));

  if (documentNavbar) {
    return (
      <div className='navbar-menu-item'>
        <Link href='/src/pages/v1/documents' classNameProp='navbar-menu-item-link' target='_self'>
          <Tooltip arrow title='Documents' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-document-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>Documents</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default Documents;
