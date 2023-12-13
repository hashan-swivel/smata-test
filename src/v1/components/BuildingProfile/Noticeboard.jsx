import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModalType } from '../../../actions/buildingProfile';
import { modalActions } from '../../../actions';
import { digitalNoticeboardConstants, inAppNoticeboardConstants } from '../../../constants';
import DigitalNoticeboardCarousel from './DigitalNoticeboard/DigitalNoticeboardCarousel';
import InAppNoticeboardCarousel from './InAppNoticeboard/InAppNoticeboardCarousel';

import 'react-alice-carousel/lib/alice-carousel.css';
import './Noticeboard.module.scss';

export const Noticeboard = ({ currentUser, buildingProfile }) => {
  const dispatch = useDispatch();
  const [displayType, setDisplayType] = useState(inAppNoticeboardConstants.TYPE); // 'internal' or 'digital'
  const canModifyNotice = currentUser.isSystemManager || currentUser.isTenantManager;

  const noticeboardCarouselByType = () => {
    if (displayType === inAppNoticeboardConstants.TYPE) {
      return <InAppNoticeboardCarousel buildingProfile={buildingProfile} />;
    }
    if (displayType === digitalNoticeboardConstants.TYPE) {
      return <DigitalNoticeboardCarousel buildingProfile={buildingProfile} />;
    }

    return null;
  };

  return (
    <div className='building-noticeboard-container'>
      <div className='noticeboard-header building-title-margin'>
        <div className='noticeboard-tabs-container'>
          <div
            className={`mobile-view-header ${
              displayType === inAppNoticeboardConstants.TYPE ? 'active' : ''
            }`}
            role='presentation'
            onClick={() => setDisplayType(inAppNoticeboardConstants.TYPE)}
          >
            <h3 className='building-title-heading h3'>Noticeboard</h3>
          </div>
          {currentUser?.feature_flags?.digital_noticeboard &&
            buildingProfile?.can_view_digital_noticeboards && (
              <div
                className={`mobile-view-header ${
                  displayType === digitalNoticeboardConstants.TYPE ? 'active' : ''
                }`}
                role='presentation'
                onClick={() => setDisplayType(digitalNoticeboardConstants.TYPE)}
              >
                <h3 className='building-title-heading h3'>Digital Noticeboard</h3>
              </div>
            )}
        </div>
        <div className='noticeboard-buttons-container'>
          {canModifyNotice && (
            <button
              type='button'
              className='button primary'
              onClick={() =>
                dispatch(
                  modalActions.showModal(
                    displayType === digitalNoticeboardConstants.TYPE
                      ? 'CREATE_EDIT_DIGITAL_NOTICEBOARD'
                      : 'CREATE_EDIT_NOTICEBOARD',
                    { buildingProfile }
                  )
                )
              }
            >
              Create Notice
            </button>
          )}
          <button
            type='button'
            className='button secondary'
            onClick={() => {
              if (displayType === inAppNoticeboardConstants.TYPE) {
                // TODO: What is this?
                dispatch(setModalType({ name: 'noticeboard' }));
              } else {
                dispatch(modalActions.showModal('DIGITAL_NOTICEBOARD_LIST', { buildingProfile }));
              }
            }}
          >
            View All
          </button>
        </div>
      </div>

      {noticeboardCarouselByType()}
    </div>
  );
};
