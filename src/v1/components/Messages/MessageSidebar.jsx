import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';
import { userOptionObj } from '../../../utils/addLabelValue';
import { formatUserLabel } from '../../../utils/helpers';
import { Avatar } from '../Avatar';
import { Link } from '../index';
import './DocumentSidebar.module.scss';

export const MessageSidebar = ({ documentData, showEditMessageModal, handlePrint }) => {
  const buildingProfile = useSelector((state) => state.buildingProfile);
  const location = useMemo(() => documentData?.location, [documentData.location]);
  const mappedUsers = useMemo(() => documentData.users?.map(userOptionObj), [documentData.users]);
  const organisationLogo = useMemo(
    () => buildingProfile.building?.theme?.logo,
    [buildingProfile.building.theme]
  );
  const strataManager = useMemo(
    () => buildingProfile.building.strata_manager,
    [buildingProfile.building]
  );

  return (
    <>
      <div className='right-sidebar-content document-content'>
        <div className='chatroom-info-header'>
          <h4>{documentData.name}</h4>
          <button
            type='button'
            className='icon icon-pencil-dark'
            onClick={(e) => showEditMessageModal(e)}
          />
          <button type='button' className='icon-download' onClick={() => handlePrint()}>
            <FontAwesomeIcon icon={faCloudDownloadAlt} />
          </button>
        </div>
        <div className='sidebar-building-info sidebar-content'>
          <div>
            <strong>The building</strong>
          </div>
          <span>
            <Link
              href='/src/pages/v1/building-profile'
              query={{ id: documentData.account.site_plan_id }}
              target='_blank'
            >
              {location.location_name}
            </Link>
          </span>
          <div className='building-info-text-container'>
            <span className='building-info-text'>Plan ID: {documentData.account.site_plan_id}</span>
            <span className='building-info-text'>Lot: N/A</span>
          </div>
          <div className='building-info-text-container'>
            {(strataManager || organisationLogo) && (
              <div className='building-info-text manager-organisation-field'>
                Managed by:{' '}
                {strataManager.full_name && (
                  <>
                    <Avatar
                      {...strataManager}
                      size='tiny'
                      firstName={strataManager.first_name}
                      lastName={strataManager.last_name}
                    />
                    {` ${strataManager.full_name}`}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className='sidebar-contacts sidebar-content'>
          <strong>Contacts in this message</strong>
          {mappedUsers.map((user) => (
            <div className='siderbar-individual-contact' key={user.id}>
              <div>
                <Avatar {...user} size='small' className='sidebar-avatar' />
                <span className='sidebar-individual-contact-name'>{user.label}</span>
              </div>
              <span className='sidebar-text-item'>{formatUserLabel(user.role)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
