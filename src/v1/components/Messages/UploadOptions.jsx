import React, { useEffect, useState } from 'react';
import './UploadOptions.module.scss';

export const UploadOptions = ({
  closeModal,
  setAcceptedFiles,
  setFileType,
  setModalTitle,
  showDropzoneModal
}) => {
  const [type, setType] = useState(null);

  useEffect(() => {
    if (!type) return;

    const acceptedFiles = type === 'document' ? 'video/*, .pdf, .doc, .zip, .xls, .csv' : 'image/*';

    closeModal();
    setModalTitle(null);
    showDropzoneModal();
    setAcceptedFiles(acceptedFiles);
    setFileType(type);
  }, [type]);

  return (
    <div className='upload-options-container'>
      <h3 className='title'>Attachments</h3>
      <p>Please select the type of attachment you'd like to add</p>
      <div className='button-container'>
        <button
          type='button'
          className='icon icon-file-plus-white message-box-icon'
          onClick={() => {
            setType('document');
          }}
        >
          Document
        </button>
        <button
          type='button'
          className='icon icon-camera-white message-box-icon'
          onClick={() => {
            setType('image');
          }}
        >
          Image
        </button>
      </div>
    </div>
  );
};
