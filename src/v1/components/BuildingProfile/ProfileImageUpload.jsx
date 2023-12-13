import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxForm, autofill, Form, FieldArray } from 'redux-form';
import { documentConstants } from '../../../constants';
import { axiosInstance } from '../../../utils';
import { Fields } from '../Form';
import { DropzoneUploader } from '../DMS/FileUpload/Dropzone';
import { UploadedFiles } from '../DMS/FileUpload/UploadedFiles';
import { validate } from '../DMS/FileUpload/validate';

import '../Messages/Message.module.scss';

const formName = 'profile_images';

const fields = (index) => [
  {
    name: 'file',
    type: 'hidden',
    noLabel: true
  },
  {
    name: 'description',
    noLabel: true,
    component: 'input',
    type: 'text',
    placeholder: 'Description',
    classNames: 'doc-name'
  }
];

const renderFieldItems = (props) => {
  const { values, syncErrors, removeFileHandler, fileArr, postFailed } = props;
  return (
    <>
      {fileArr.map((file, index) => (
        <div key={file.id}>
          <div className='uploaded-grid component-background'>
            <UploadedFiles file={file} index={index} removeFileHandler={removeFileHandler} />
            <div className='file-upload-bottom'>
              <Fields
                fields={fields(index)}
                containerClass='file-inputs'
                submitFailed={postFailed}
                syncErrors={syncErrors}
                values={values}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const ProfileImageForm = ({
  handleSubmit,
  submitFailed,
  closeUploadModal,
  buildingProfile,
  profileImages,
  setProfileImages
}) => {
  const dispatch = useDispatch();
  const [baseFile, setBaseFile] = useState([]);
  const formState = useSelector((state) => state.form[formName]) || {
    syncErrors: {},
    values: {}
  };
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { syncErrors, values } = formState;
  const [postFailed, setPostFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileArr, setFileArr] = useState(values.file || []);

  const onSubmit = () => {
    const { description } = values;
    if (syncErrors) {
      setPostFailed(true);
      return null;
    }
    if (fileArr.length >= 1) {
      if (!uploading) {
        setUploading(true);
      }
      let theCount = 0;
      fileArr.map((_item, index) => {
        const params = { ...baseFile[index], description };
        axiosInstance
          // Post the base64 formatted file and values to database
          .post(
            `/v1/building_profile/${encodeURIComponent(buildingProfile?.site_plan_id)}/add_image`,
            params,
            {}
          )
          .then(async (res) => {
            setProfileImages([...profileImages, res.data]);
          })
          // Once uploaded, increment the count used to check if all have uploaded
          .then(() => {
            theCount += 1;
            return theCount;
          })
          // If the amount uploaded = length of the array of files to be uploaded, reset fileArray/form
          .then(() => {
            if (theCount === fileArr.length) {
              setUploading(false);
              setFileArr([]);
              dispatch(autofill(formName, 'file', []));
              dispatch(autofill(formName, 'description', ''));
              closeUploadModal();
            }
          })
          .catch((error) => console.log(error));
      });
    }
  };

  // Run after an accepted filetype is added to the uploader
  const addFileHandler = (promises, files) => {
    // Copy of the fileArray containing files to be uploaded
    const clonedFileArray = [...fileArr];
    // Copy of the array containing the base64 format of files
    const clonedBaseFile = [...baseFile];

    // Loop through the files added to the uploader
    files.map((file, index) => {
      // Deconstruct path, name, size and type
      const { path, name, size, type } = file;
      const newType = type.split('/')[1];
      // Add a key/value pair containing the base64 format of the file and push to the clonedBaseFile array
      clonedBaseFile.push({ file: promises[index], filename: name });
      // Add the path, name, size and type to the array containing all files to be uploaded
      clonedFileArray.push({
        path,
        filename: name,
        file_size: size,
        type: newType
      });
    });
    // Set the fileArray to be uploaded as the clonedFileArray
    setFileArr(clonedFileArray);
    // Set the baseFile array to be uploaded as the clonedBaseFile array
    setBaseFile(clonedBaseFile);
  };

  // Remove file from the fileArray
  const removeFileHandler = (file) => {
    const newArray = [...fileArr];
    newArray.splice(file, 1);
    setFileArr(newArray);
  };

  const toggleCloseButton = (event) => closeUploadModal(event);

  return (
    <div className='file-upload-container'>
      <p className='title p'>Upload Image</p>
      <DropzoneUploader
        addFileHandler={addFileHandler}
        acceptedFiles={documentConstants.IMAGE_ACCEPTED_FILES}
        allowMultiple
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='upload-file-modal'>
          <FieldArray
            name='file'
            component={renderFieldItems}
            values={values}
            syncErrors={syncErrors}
            postFailed={postFailed}
            removeFileHandler={removeFileHandler}
            fileArr={fileArr}
          />
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
            className={`button primary ${uploading ? 'uploading' : ''}`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Done'}
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
    file: []
  },
  validate
})(ProfileImageForm);
