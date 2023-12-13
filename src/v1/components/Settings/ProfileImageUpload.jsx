import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxForm, autofill, Form } from 'redux-form';
import { Fields } from '../Form';
import { documentConstants } from '../../../constants';
import { DropzoneUploader } from '../DMS/FileUpload/Dropzone';
import { UploadedFiles } from '../DMS/FileUpload/UploadedFiles';
import { validate } from '../DMS/FileUpload/validate';
import { updateUserProfileImage } from '../../../actions/fileUpload';
import './ProfileImageUpload.module.scss';

const formName = 'profileImage';

const fields = [
  {
    name: 'file',
    type: 'hidden',
    label: ''
  }
];

const FileFied = (props) => {
  const { values, syncErrors, removeFileHandler, file, postFailed } = props;
  return (
    <div className='uploaded-grid component-background'>
      <UploadedFiles file={file} removeFileHandler={removeFileHandler} />
      <div className='file-upload-bottom'>
        <Fields
          fields={fields}
          containerClass='file-inputs'
          submitFailed={postFailed}
          syncErrors={syncErrors}
          values={values}
        />
      </div>
    </div>
  );
};

const ProfileImageForm = ({ handleSubmit, submitFailed, closeUploadModal }) => {
  const dispatch = useDispatch();
  const [baseFile, setBaseFile] = useState(null);
  const formState = useSelector((state) => state.form[formName]) || {
    syncErrors: {},
    values: {}
  };

  const { syncErrors, values } = formState;
  const [postFailed, setPostFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(values.file || null);

  const onSubmit = () => {
    if (syncErrors) {
      setPostFailed(true);
      return null;
    }
    if (file) {
      if (!uploading) {
        setUploading(true);
      }
    }

    dispatch(updateUserProfileImage(baseFile));
    setUploading(false);
    dispatch(autofill(formName, 'file', null));
    closeUploadModal();
  };

  // Run after an accepted filetype is added to the uploader
  const addFileHandler = (promises, files) => {
    const file = files[0]; //only uploading single image
    const { path, name, size, type } = file;
    const newType = type.split('/')[1];

    const clonedBaseFile = { file: promises[0], filename: name };
    const clonedFile = { path, filename: name, file_size: size, type: newType };
    setBaseFile(clonedBaseFile);
    setFile(clonedFile);
  };

  // Remove file
  const removeFileHandler = (file) => {
    setFile(null);
  };

  const toggleCloseButton = (event) => closeUploadModal(event);

  return (
    <div className='profile-image-uploader file-upload-container'>
      <p className='title'>Upload Image</p>
      {!file && (
        <DropzoneUploader
          addFileHandler={addFileHandler}
          acceptedFiles={documentConstants.IMAGE_ACCEPTED_FILES}
        />
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='upload-file-modal'>
          {file && (
            <FileFied
              values={values}
              syncErrors={syncErrors}
              postFailed={postFailed}
              removeFileHandler={removeFileHandler}
              file={file}
            />
          )}
        </div>
        <div className='button-container'>
          <button
            type='button'
            className='button secondary'
            onClick={(event) => {
              toggleCloseButton(event);
            }}
          >
            Close
          </button>
          <button
            type='submit'
            className={`button primary ${uploading ? 'uploading' : null}`}
            disabled={uploading}
          >
            {!uploading ? 'Done' : 'Uploading...'}
          </button>
        </div>
      </Form>
    </div>
  );
};

export const ProfileImageUpload = reduxForm({
  form: formName,
  destroyOnUnmount: false,
  initialValues: {
    file: null
  },
  validate
})(ProfileImageForm);
