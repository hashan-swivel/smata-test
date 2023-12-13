import React from 'react';
import './ContinueModal.module.scss';

export const ContinueModal = (props) => {
  const { handleCancel, handleContinue } = props;

  return (
    <div className='delete-modal-container'>
      <div className='delete-modal-container-inner'>
        <h3 className='notice-title'>
          Are you sure you want to Close? Your changes will not be saved.
        </h3>
        <div className='delete_modal_btn_box'>
          <button type='button' onClick={handleCancel} className='cancel-btn'>
            Cancel
          </button>
          <button type='button' onClick={handleContinue} className='delete-btn'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
