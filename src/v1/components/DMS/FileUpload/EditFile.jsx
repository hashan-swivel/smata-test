import React, { useState } from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reduxForm, autofill, Form } from 'redux-form';
import { axiosInstance } from '../../../../utils';
import { DropzoneUploader } from './Dropzone';
import { UploadedFiles } from './UploadedFiles';
import { Fields } from '../../Form';
import './EditFile.module.scss';

const formName = 'EditFile';

const fields = [
  {
    name: 'file',
    type: 'hidden',
    label: ''
  }
];

const FileField = (props) => {
  const { values, syncErrors, removeFileHandler, file } = props;
  return (
    <div className='uploaded-grid component-background'>
      <UploadedFiles file={file} removeFileHandler={removeFileHandler} />
      <div className='file-upload-bottom'>
        <Fields
          fields={fields}
          containerClass='file-inputs'
          syncErrors={syncErrors}
          values={values}
        />
      </div>
    </div>
  );
};

const EditFileForm = ({ handleSubmit, closeModal, doc }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [fileUpload, setFileUpload] = useState();
  const [fileName, setFileName] = useState();
  const formState = useSelector((state) => state.form[formName]) || {
    syncErrors: {},
    values: {}
  };
  const { syncErrors, values } = formState;
  const [file, setFile] = useState(values.file || null);

  const onSubmit = async () => {
    setUploading(true);
    dispatch(autofill(formName, 'file', null));
    const query = `filename=${fileName}`;
    const postBody = {
      file: fileUpload
    };
    try {
      await axiosInstance.put(`/v1/documents/${doc.id}?${query}`, postBody);
      closeModal();
      setUploading(false);
      Router.reload();
    } catch (error) {
      console.error('Error @EditFile addFileHandler', error);
    }
  };

  const addFileHandler = async (base64, files) => {
    const file = files[0];
    const { path, name, size, type } = file;
    const newType = type.split('/')[1];
    const clonedFile = { path, filename: name, file_size: size, type: newType };
    setFile(clonedFile);
    setFileName(name);
    setFileUpload(base64[0]);
  };

  const removeFileHandler = (file) => {
    setFile(null);
  };

  return (
    <div className='edit-file'>
      <DropzoneUploader addFileHandler={addFileHandler} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='upload-file-modal'>
          {fileName && (
            <FileField
              values={values}
              syncErrors={syncErrors}
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
              closeModal();
            }}
          >
            Close
          </button>
          <button
            type='submit'
            className={`button primary ${uploading ? 'uploading' : ''}`}
            disabled={uploading || !file}
          >
            {!uploading ? 'Save' : 'Uploading'}
          </button>
        </div>
      </Form>
    </div>
  );
};

export const EditFile = reduxForm({
  form: formName,
  initialValues: {
    file: null
  }
})(EditFileForm);
