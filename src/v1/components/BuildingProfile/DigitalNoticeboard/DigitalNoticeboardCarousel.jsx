import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import * as moment from 'moment';

import AliceCarousel from 'react-alice-carousel';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { warningSwal } from '../../../../utils';
import { digitalNoticeboardActions, modalActions } from '../../../../actions';
import { Loading } from '../../Loading';
import { NotFound } from '../../DMS';
import { DigitalNoticeboardPreview } from './DigitalNoticeboardPreview';
import { datetimeConstants } from '../../../../constants';

import './DigitalNoticeboardCarousel.module.scss';

const DigitalNoticeboardCarousel = ({ list, listLoading, dispatch, buildingProfile }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const activeDigitalNoticeboards = list.filter((i) => i.state === 'active');

  const responsive = {
    0: { items: 1 },
    660: { items: 2 },
    1024: { items: 4 }
  };

  useEffect(() => {
    dispatch(digitalNoticeboardActions.getDigitalNoticeboards({ by_account: buildingProfile?.id }));
  }, []);

  if (listLoading) {
    return <Loading componentLoad />;
  }

  if (activeDigitalNoticeboards.length === 0) {
    return <NotFound text='No Digital Noticeboard Found' />;
  }

  const handleDeleteNoticeboardClicked = (id) => {
    withReactContent(Swal)
      .fire(warningSwal({ confirmButtonText: 'DELETE' }))
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(digitalNoticeboardActions.deleteDigitalNoticeboard(id));
        }
      });
  };

  const carouselItems = () =>
    activeDigitalNoticeboards.map((item) => (
      <div className='digital-noticeboard-carousel-item' key={item.id}>
        {currentUser?.isTenantManager && (
          <div className='digital-noticeboard-carousel-item__header'>
            <span
              className={`digital-noticeboard-carousel-item__status digital-noticeboard-carousel-item--${item.state}`}
            >
              {item.state}
            </span>
            <div className='buttons-container'>
              <button
                type='button'
                className='button button--link-dark'
                onClick={() => {
                  dispatch(
                    modalActions.showModal('CREATE_EDIT_DIGITAL_NOTICEBOARD', {
                      noticeboard: item,
                      buildingProfile
                    })
                  );
                }}
              >
                <FontAwesomeIcon icon={faPencilAlt} size='sm' />
              </button>
              <button
                type='button'
                className='button button--link-dark'
                style={{ paddingRight: 0 }}
                onClick={() => handleDeleteNoticeboardClicked(item.id)}
              >
                <FontAwesomeIcon icon={faTrashAlt} size='sm' />
              </button>
            </div>
          </div>
        )}

        <div className='digital-noticeboard-carousel-item__body'>
          <DigitalNoticeboardPreview digitalNoticeboard={item} />
        </div>
        <div className='digital-noticeboard-carousel-item__footer'>
          <div className='digital-noticeboard-carousel-item__screen-name'>
            <h4 className='h4' style={{ color: '#4A90E2' }}>{item?.digital_noticeboard_screen?.name}</h4>
          </div>
          {currentUser?.isTenantManager && item.start_at && item.end_at && (
            <div className='digital-noticeboard-carousel-item__time-frame'>
              {[
                moment.unix(item.start_at).format(datetimeConstants.FORMAT.DEFAULT),
                moment.unix(item.end_at).format(datetimeConstants.FORMAT.DEFAULT)
              ].join(' - ')}
            </div>
          )}
        </div>
      </div>
    ));

  return (
    <div className='noticeboard-grid'>
      <AliceCarousel
        mouseTrackingEnabled
        touchTrackingEnabled
        preventEventOnTouchMove
        responsive={responsive}
        dotsDisabled
        autoPlay
        autoPlayInterval={7000}
        items={carouselItems()}
      />
    </div>
  );
};

export default connect((state) => state.digitalNoticeboards)(DigitalNoticeboardCarousel);
