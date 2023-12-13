import React from 'react';
import './UploadProgress.module.scss';
import { FileType } from '../../FileType';

export const UploadProgress = (props) => {
  const { percentage, file, removeFileHandler } = props;

  return (
    <div className='component-background file-upload-top'>
      <FileType type={file} />
      <div className='uploaded-top-details'>
        <p>Uploading File... {percentage.toFixed(2)}% </p>
        <div className='progress-bar'>
          <div className='filler' style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
      <div>
        <button
          type='button'
          className='icon icon-cross-white delete-cross'
          onClick={() => removeFileHandler(file)}
        ></button>
      </div>
    </div>
  );
};
