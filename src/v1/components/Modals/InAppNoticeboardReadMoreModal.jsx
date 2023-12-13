import React from 'react';
import { connect } from 'react-redux';
import ModalContainer from './ModalContainer';

import './InAppNoticeboardReadMoreModal.module.scss';
import { Link } from '../Link';

const InAppNoticeboardReadMoreModal = ({ noticeboard }) => {
  return (
    <ModalContainer
      title='Noticeboard'
      reactModalProps={{
        shouldCloseOnOverlayClick: false,
        className: 'c-modal__container c-modal__container--lg'
      }}
    >
      <div className='c-modal__body'>
        <div className='public-notice-item--cover-image-wrapper'>
          <img
            className='public-notice-item--cover-image'
            src={noticeboard.cover_image}
            alt='Preview'
          />
        </div>

        <h2 className='h2' title={noticeboard.title}>{noticeboard.title}</h2>
        <hr className='hr' />
        <div className='public-notice-item--text'>
          <div dangerouslySetInnerHTML={{ __html: noticeboard.text }} />
        </div>
        {noticeboard.type === 'document' && (
          <Link
            href={noticeboard?.attachment?.url}
            target='_blank'
            download
            classNameProp='download'
          >
            Download
          </Link>
        )}
      </div>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(InAppNoticeboardReadMoreModal);
