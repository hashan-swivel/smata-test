import React from 'react';
import { Tooltip } from 'react-tippy';
import { Link } from '../../Link';
import { isFeatureEnabled } from '../../../../utils/userHelpers';

const StrataIntegration = ({ user }) => {
  const strataMasterIntegration =
    user.isOrganisationAdmin && isFeatureEnabled(user, 'strata_master_integration');

  if (strataMasterIntegration) {
    return (
      <div className='navbar-menu-item'>
        <Link
          href='/src/pages/v1/strata-integration'
          classNameProp='navbar-menu-item-link'
          target='_self'
        >
          <Tooltip arrow title='SMATA Integration' position='bottom' animation='fade' theme='light'>
            <span className='icon icon-strata-master-integration-white nav-icon' />
          </Tooltip>
          <span className='icon-text'>SMATA Integration</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default StrataIntegration;
