import React from 'react';
import { documentConstants } from '../../../../constants';
import Dropzone from '../../Shared/Dropzone';

import './Dropzone.module.scss';

// TODO: Change to use shared/Dropzone
export const DropzoneUploader = (props) => {
  const { addFileHandler, acceptedFiles, allowMultiple, title } = props;

  const convertFileToBase64 = async (files, addFileHandlerCallback) => {
    const getBase64 = (file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    };
    // here will be array of promisified functions
    const promises = [];

    // loop through fileList with for loop
    for (let i = 0; i < files.length; i += 1) {
      promises.push(getBase64(files[i]));
    }

    // array with base64 strings
    Promise.all(promises)
      .then((res) => addFileHandlerCallback(res, files))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {title ? <h2 className='modal-content-title'>Upload {title}</h2> : null}
      <Dropzone
        handleDropAccepted={(files) => convertFileToBase64(files, addFileHandler)}
        options={{ accept: acceptedFiles, multiple: allowMultiple }}
      />
    </div>
  );
};

DropzoneUploader.defaultProps = { acceptedFiles: documentConstants.DEFAULT_ACCEPTED_FILES };
