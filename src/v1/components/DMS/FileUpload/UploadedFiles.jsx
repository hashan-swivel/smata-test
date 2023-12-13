import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import formatBytes from '../helpers/formatBytes';
import { FileType } from '../../FileType';
import './UploadedFiles.module.scss';

export const UploadedFiles = (props) => {
  const { removeFileHandler, file, index } = props;

  if (!file) {
    return null;
  }
  return (
    <div className='file-upload-top'>
      <FileType type={file.type} />
      <div className='uploaded-top-details'>
        <p className='file-name'>{file.filename}</p>
        <p className='file-size'>{formatBytes(file.file_size)}</p>
      </div>
      <div>
        <button
          type='button'
          className='icon icon-cross-white delete-cross'
          onClick={() => removeFileHandler(index)}
        >
          <FontAwesomeIcon icon={faTimes} color='#000' />
        </button>
      </div>
    </div>
  );
};
