import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import * as moment from 'moment';
import AliceCarousel from 'react-alice-carousel';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { inAppNoticeboardActions, modalActions } from '../../../../actions';
import { Loading } from '../../Loading';
import { NotFound } from '../../DMS';
import { setModalType } from '../../../../actions/buildingProfile';
import { Link } from '../../Link';
import { warningSwal } from '../../../../utils';

import './InAppNoticeboardCarousel.module.scss';

const InAppNoticeboardCarousel = ({ list, listLoading, dispatch, buildingProfile }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const canModifyNotice = currentUser.isSystemManager || currentUser.isTenantManager;

  const responsive = {
    0: { items: 1 },
    660: { items: 2 },
    1024: { items: 4 }
  };

  useEffect(() => {
    dispatch(
      inAppNoticeboardActions.getInAppNoticeboards({ spNumber: buildingProfile?.site_plan_id })
    );
  }, []);

  if (listLoading) {
    return <Loading componentLoad />;
  }

  if (list.length === 0) {
    return <NotFound text='Noticeboard Not Found' />;
  }

  const handleDeleteNoticeboardClicked = (id) => {
    withReactContent(Swal)
      .fire(warningSwal({ confirmButtonText: 'DELETE' }))
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(
            inAppNoticeboardActions.deleteInAppNoticeboard(id, buildingProfile?.site_plan_id)
          );
        }
      });
  };

  const carouselItems = () =>
    list.map((item) => (
      <div key={item.id} className='public-notice-item'>
        {canModifyNotice && (
          <div className='public-notice-item--action-buttons'>
            <button
              type='button'
              className='button button--link-dark'
              onClick={() =>
                dispatch(
                  modalActions.showModal('CREATE_EDIT_NOTICEBOARD', {
                    noticeboard: item,
                    buildingProfile
                  })
                )
              }
              style={{ padding: 0, paddingRight: '10px' }}
            >
              <FontAwesomeIcon icon={faPencilAlt} size='sm' />
            </button>
            <button
              type='button'
              className='button button--link-dark'
              onClick={() => handleDeleteNoticeboardClicked(item.id)}
              style={{ padding: 0 }}
            >
              <FontAwesomeIcon icon={faTrashAlt} size='sm' />
            </button>
          </div>
        )}

        <div className='public-notice-item--cover-image-wrapper'>
          <img className='public-notice-item--cover-image' src={item.cover_image} alt='Preview' />
        </div>

        <h5 className='public-notice-item--title h5' title={item.title}>
          {item.title}
        </h5>

        <div className='public-notice-item--meta-data'>
          <div style={{ fontSize: '.8rem' }}>
            {moment.unix(item.updated_at).format('lll')}
            {' - '}
            &nbsp;
            {item.uploader ? `${item.uploader.first_name} ${item.uploader.last_name}` : '...'}
          </div>
        </div>
        <div className='public-notice-item--text'>
          {item.text ? <div dangerouslySetInnerHTML={{ __html: item.text }} /> : null}
        </div>
        <div className='public-notice-item--more-action'>
          {item.text && (
            <button
              type='button'
              className='button button--secondary mr-1'
              onClick={() =>
                dispatch(
                  modalActions.showModal('IN_APP_NOTICEBOARD_READ_MORE', { noticeboard: item })
                )
              }
            >
              {item.uploader ? 'Read More' : 'Loading...'}
            </button>
          )}
          {item.type === 'document' && (
            <Link
              href={item?.attachment?.url}
              target='_blank'
              download
              classNameProp='button button--primary'
            >
              Download
            </Link>
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

export default connect((state) => state.inAppNoticeboards)(InAppNoticeboardCarousel);
