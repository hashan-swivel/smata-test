import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import { modalConstants, shareConstants } from '../../../constants';
import { modalActions } from '../../../actions';

import './ModalContainer.module.scss';

// PLEASE READ THE DOCUMENT http://reactcommunity.org/react-modal/ AND TRY NOT TO EDIT THIS WRAPPER.
// If your modal has different styling or different buttons or different behavior, just wrap the <ReactModal> inside your modal
const ModalContainer = ({
  modalType,
  dispatch,
  title,
  children,
  dismissible = true,
  reactModalProps = {}
}) => {
  useEffect(() => {
    // Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
    if (typeof window !== 'undefined') ReactModal.setAppElement(shareConstants.ROOT_ID);
  }, []);

  function modalHeader() {
    if (title || dismissible) {
      return (
        <div className='c-modal__header'>
          {title && <h2 className='c-modal__title h2'>{title}</h2>}
          {dismissible && (
            <button
              className='c-modal__header-close'
              onClick={() => dispatch(modalActions.hideModal())}
              type='button'
            >
              &times;
            </button>
          )}
        </div>
      );
    }
  }

  return (
    <ReactModal
      isOpen={!!modalType}
      onRequestClose={() => dispatch(modalActions.hideModal())}
      style={modalConstants.STYLES}
      className='c-modal__container'
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      ariaHideApp={false}
      {...reactModalProps}
    >
      {modalHeader()}
      {children}
    </ReactModal>
  );
};

export default connect((state) => state.modal)(ModalContainer);
