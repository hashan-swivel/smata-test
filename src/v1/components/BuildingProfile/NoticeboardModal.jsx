import React from 'react';
import { useDispatch } from 'react-redux';
import Moment from 'moment';
import { NotFound } from '../DMS';
import { modalActions } from '../../../actions';

import './NoticeboardModal.module.scss';

export const NoticeboardModal = ({ noticeboardItems }) => {
  const convertDate = (date) => Moment.unix(date).format('MMMM Do YYYY');

  const dispatch = useDispatch();

  return (
    <div className='noticeboard-modal-container'>
      <h3 className='noticeboard-modal-title h3'>Noticeboard</h3>
      <div className='noticeboard-modal-list-container'>
        {noticeboardItems.map((item) => (
          <div
            key={item.id}
            className='noticeboard-modal-content-grid'
            role='presentation'
            onClick={() =>
              dispatch(
                modalActions.showModal('IN_APP_NOTICEBOARD_READ_MORE', { noticeboard: item })
              )
            }
          >
            <div className='icon-container'>
              <span className='icon icon-pushpin' />
              <span className='work-green-line' />
            </div>
            <div className='work-text'>
              <div className='job-container'>
                <div className='subtitle'>{item.title}</div>
                <div className='job-date'>Created: {convertDate(item.created_at)}</div>
              </div>
            </div>
          </div>
        ))}

        {noticeboardItems?.length === 0 && <NotFound text='Noticeboard is Empty' />}
      </div>
    </div>
  );
};
