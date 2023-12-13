import React from 'react';
import './UploadSuccessModal.module.scss';

export const UploadSuccessModal = (props) => {
  return (
    <div className='upload-modal-container'>
      <div className='upload-modal-container-inner'>
        <h3 className='notice-title'>Document has been successfully uploaded.</h3>
      </div>
    </div>
  );
};
