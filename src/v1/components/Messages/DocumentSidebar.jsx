import React from 'react';
import { useSelector } from 'react-redux';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { userOptionObj } from '../../../utils/addLabelValue';
import { Avatar } from '../Avatar';
import { FilePreview } from '../DMS/DocumentView/FilePreview';
import { Link } from '../index';
import { FilePreviewFooter } from '../DMS/DocumentView';

import './DocumentSidebar.module.scss';

export const DocumentSidebar = ({
  documentData,
  docUrl,
  showArchived,
  showEditMessageModal,
  handlePrint
}) => {
  if (documentData) {
    const { attachments, location, users } = documentData;
    const buildingProfile = useSelector((state) => state.buildingProfile);
    const strataManager = buildingProfile.building.strata_manager;
    const organisationLogo = buildingProfile.building?.theme?.logo ?? null;
    const mappedUsers = users.map(userOptionObj);

    const {
      id: docId,
      filename,
      display_name: displayName,
      file_extension: fileExtension,
      category,
      sp_number: spNumber
    } = attachments[0];

    const formatUserLabel = (role) => {
      if (role === 'strata_manager') return 'Strata Manager';
      if (role === 'strata_member') return 'Strata Member';
      if (role === 'committee_member') return 'Committee Member';
      if (role === 'building_manager') return 'Building Manager';
      return 'Association';
    };

    return (
      <>
        <div className='right-sidebar-content document-content'>
          <div className='chatroom-info-header'>
            <h4>{displayName}</h4>
            <button
              type='button'
              className='icon icon-pencil-dark'
              onClick={(e) => showEditMessageModal(e)}
            />
            <button
              type='button'
              className='icon-download'
              title='Download conversation'
              onClick={() => handlePrint()}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
          <FilePreview
            url={docUrl}
            doc={documentData?.attachments.length > 0 ? documentData?.attachments[0] : {}}
            type={fileExtension}
            name={filename}
            viewOnly={showArchived}
          />
          <FilePreviewFooter
            viewOnly={showArchived}
            file={docUrl}
            doc={documentData?.attachments.length > 0 ? documentData?.attachments[0] : {}}
          />
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
              <span className='building-info-text'>Plan ID: {spNumber}</span>
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
          <div className='sidebar-building-category sidebar-content'>
            <strong>Type of document</strong>
            <div className='sidebar-category-items'>
              {/* {document.category.length > 1 ? (
                document.category.map(item => <span className="sidebar-text-item">{item.label}</span>)
              ) : ( */}
              <span className='sidebar-text-item'>{category}</span>
              {/* )} */}
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
        <div className='sidebar-view-document'>
          <Link
            href={`/${category === 'invoice' ? 'invoice' : 'document-preview'}`}
            query={{ id: docId }}
          >
            <button type='button' className='button primary sidebar-view-document-button'>
              View {category}
            </button>
          </Link>
        </div>
      </>
    );
  }
  return null;
};
