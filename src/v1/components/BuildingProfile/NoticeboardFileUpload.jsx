import React, { useEffect } from 'react';
import { autofill, reduxForm, reset } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { DropzoneUploader } from '../DMS/FileUpload/Dropzone';
import { documentConstants } from '../../../constants';
import { getCategories } from '../../../actions/categories';
import { Fields } from '../Form/Fields';
import { UploadedFiles } from '../DMS/FileUpload/UploadedFiles';

const fields = (categories) => [
  {
    name: `filename`,
    label: 'File name',
    component: 'input',
    type: 'text',
    placeholder: 'Name',
    classNames: 'doc-name'
  },
  {
    name: 'docCategory',
    label: 'Document Category',
    placeholder: 'Category',
    component: 'react-select',
    classNames: 'doc-category',
    options: categories // Loading categories from endpoint api/v1/categories
  }
];

const formName = 'noticeboardFileUpload';
const NoticeboardFileUpload = () => {
  const dispatch = useDispatch();
  const { values } = useSelector((state) => state.form[formName]) ?? {};
  const categories = useSelector((state) => state.categories.categories);
  const categoriesLoading = useSelector((state) => state.categories.loading);

  useEffect(() => {
    if (!categories.length && categoriesLoading) dispatch(getCategories());
  }, [categories]);

  const addFileHandler = (promises, files) => {
    if (files.length > 0 && promises.length > 0) {
      dispatch(autofill(formName, 'baseFile', promises[0]));

      const { path, name, size, type } = files[0];
      const nameWithoutExtension = name.substr(0, name.lastIndexOf('.')) || name;
      const extension = name.substr(name.lastIndexOf('.') + 1, name.length) || name;
      const newType = type.split('/')[1];
      const file = {
        path,
        filename: nameWithoutExtension,
        file_extension: extension,
        file_size: size,
        type: newType
      };
      dispatch(autofill(formName, 'file', file));
      dispatch(autofill(formName, 'filename', nameWithoutExtension));
    }
  };

  const removeFileHandler = () => {
    dispatch(reset(formName));
  };

  return (
    <div className='noticeboard-file-upload' style={{ marginTop: '10px', marginBottom: '20px' }}>
      <span className='label'>Upload a document</span>
      <div style={{ marginBottom: '10px' }}>
        {values && !values.file && (
          <DropzoneUploader
            addFileHandler={addFileHandler}
            acceptedFiles={documentConstants.DEFAULT_ACCEPTED_FILES}
            allowMultiple={false}
          />
        )}
        {values && values.file && (
          <UploadedFiles file={values.file} index={0} removeFileHandler={removeFileHandler} />
        )}
      </div>
      {values && values.file && <Fields fields={fields(categories)} values={values} />}
    </div>
  );
};

export default reduxForm({
  form: 'noticeboardFileUpload',
  initialValues: {}
})(NoticeboardFileUpload);
