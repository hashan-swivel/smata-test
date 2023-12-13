import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxForm, autofill, Form, FieldArray, reset } from 'redux-form';
import Router from 'next/router';
import { addLabelToSpList, axiosInstance } from '../../../../utils';
import { Fields } from '../../Form';
import { AdditionalFields } from './AdditionalFields';
import { GlobalFields } from './GlobalFields';
import { DropzoneUploader } from './Dropzone';
import { UploadedFiles } from './UploadedFiles';
import { validate } from './validate';
import './FileUpload.module.scss';
import { getOrgUsers } from '../../../../actions/users';
import { getCategories } from '../../../../actions/categories';
import { flashActions, getLotNumbers } from '../../../../actions';

const formName = 'files';

const fields = (index, spNumbers, categories, setLotNumbers, type) => [
  {
    name: 'file',
    type: 'hidden',
    noLabel: true
  },
  {
    name: `file[${index}].validSpNumber`,
    type: 'hidden',
    classNames: 'hidden-field',
    noLabel: true
  },
  {
    name: `file[${index}].filename`,
    noLabel: true,
    component: 'input',
    type: 'text',
    placeholder: 'Name',
    classNames: 'doc-name'
  },
  {
    name: `file[${index}].spNumber`,
    placeholder: 'Plan Number',
    component: 'react-select',
    classNames: 'sp-number',
    noLabel: true,
    leftCol: type === 'document',
    options: addLabelToSpList(spNumbers),
    customOnChange: setLotNumbers(index)
  },
  {
    name: `file[${index}].docCategory`,
    noLabel: true,
    placeholder: 'Category',
    component: 'react-select',
    classNames: 'doc-category',
    rightCol: true,
    options: categories, // Loading categories from endpoint api/v1/categories
    hidden: type === 'invoice'
  },
  {
    name: `file[${index}].suggestFileName`,
    type: 'hidden',
    noLabel: true
  }
];

const renderFieldItems = ({
  values,
  syncErrors,
  removeFileHandler,
  fileArr,
  onChangeHandler,
  postFailed,
  spNumbers,
  onClickSuggestFileName,
  categories,
  setLotNumbers,
  type
}) => (
  <>
    {fileArr.map((file, index) => (
      <div key={`${file.id}-${index}`}>
        <div className='uploaded-grid component-background'>
          <UploadedFiles file={file} index={index} removeFileHandler={removeFileHandler} />
          <div className='file-upload-bottom'>
            <p className='document-details'>Document details</p>
            <Fields
              fields={fields(index, spNumbers, categories, setLotNumbers, type)}
              containerClass='file-inputs'
              submitFailed={postFailed}
              syncErrors={syncErrors}
              values={values}
              onChange={(value) => onChangeHandler(value, index)}
            />
            <a
              href='#'
              className='suggest-file-name'
              onClick={(e) => onClickSuggestFileName(e, index, suggestFileName(values, index))}
            >
              Suggested Name: <span className='suggest-link'>{suggestFileName(values, index)}</span>
            </a>
          </div>
          <AdditionalFields
            submitFailed={postFailed}
            syncErrors={syncErrors}
            values={values}
            index={index}
            file={file}
          />
        </div>
      </div>
    ))}
  </>
);

const suggestFileName = (values, index) => values?.file[index]?.suggestFileName;

const FileForm = ({ handleSubmit, closeModal, successModalEvent, setContinueModal, type }) => {
  const dispatch = useDispatch();
  const [baseFile, setBaseFile] = useState([]);
  const formState = useSelector((state) => state.form[formName]) || {
    syncErrors: {},
    values: {}
  };
  const spNumbers = useSelector((state) => state.spNumbers.orgSpNumbers);
  const categories = useSelector((state) => state.categories.categories);
  const categoriesLoading = useSelector((state) => state.categories.loading);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const { syncErrors, values } = formState;
  const [postFailed, setPostFailed] = useState(false);
  const [fileArr, setFileArr] = useState(values.file || []);
  const globalSpNumber = values?.global?.spNumber?.name;
  const globalDocCategory = values?.global?.docCategory?.label;
  const [spNumber, setSpNumber] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!categories.length && categoriesLoading) dispatch(getCategories());
  }, [categories]);

  useEffect(() => {
    if (spNumber) dispatch(getLotNumbers(spNumber));
  }, [spNumber]);

  /**
   * Remove invoice category from category list if the upload type is document
   */
  useEffect(() => {
    if (categories) {
      setFilteredCategories(
        type === 'document'
          ? categories.filter((category) => category.value !== 'invoice')
          : categories
      );
    }
  }, [categories, type]);

  const setLotNumbers = (index) => {
    const newSpNumber = values.global?.spNumber?.value || values.file[index]?.spNumber?.value;
    setSpNumber(newSpNumber);
  };

  const filesExist =
    fileArr.length > 0 && baseFile.length > 0 && fileArr.length === baseFile.length;

  const documentParams = (index) => ({
    category: values.global.docCategory
      ? values.global.docCategory.value
      : values.file[index].docCategory.value,
    display_filename: values.file[index].filename,
    filename: `${values.file[index].filename}.${values.file[index].file_extension}`.replace(
      /[/\\?%*:|"<>\s+]/g,
      '-'
    ),
    sp_number: values.global?.spNumber?.value || values.file[index].spNumber.value,
    popular: values.file[index].addToPopular,
    lot_number_id: values.global?.lotNumber?.value || values.file[index]?.lotNumber?.value
  });

  const noticeBoardParams = (index, response) => ({
    attachment_id: response.data.id,
    notice_type: 'document',
    text: values.file[index].noticeboardText,
    title: values.file[index].noticeboardTitle
  });

  const updateDocumentAttrs = (index) => {
    const tagsAttrs = values.file[index].tags
      ? values.file[index].tags.map((tag) => `tags_attributes[][name]=${tag.value}`).join('&')
      : '';

    let _sharedWith = [];
    if (values.global.sharedWith?.length > 0) {
      _sharedWith = values.global.sharedWith;
    } else if (values.file[index].sharedWith?.length > 0) {
      _sharedWith = values.file[index].sharedWith;
    }

    const additionalUsersAttrs =
      _sharedWith.length > 0
        ? _sharedWith.map((user) => `additional_users_attributes[][id]=${user.id}`).join('&')
        : '';

    let invoicePriceAttrs = '';
    let invoiceNumberAttrs = '';

    if (
      ((values.global.docCategory && values.global.docCategory.value === 'invoice') ||
        (values.file[index].docCategory && values.file[index].docCategory.value === 'invoice')) &&
      (values.file[index].invoicedPrice || values.file[index].invoicedNumber)
    ) {
      invoicePriceAttrs = values.file[index].invoicedPrice
        ? `invoice_attributes[invoiced_price]=${values.file[index].invoicedPrice}`
        : '';

      invoiceNumberAttrs = values.file[index].invoicedNumber
        ? `invoice_attributes[invoice_number]=${values.file[index].invoicedNumber}`
        : '';
    }

    return [tagsAttrs, additionalUsersAttrs, invoicePriceAttrs, invoiceNumberAttrs]
      .filter((i) => i.length > 0)
      .join('&');
  };

  const onSubmit = async () => {
    if (values.file.length === 0) {
      closeModal();
      dispatch(flashActions.showError('Please attach a file when creating a new document.'));
      return null;
    }

    if (!filesExist) {
      closeModal();
      setFileArr([]);
      setBaseFile([]);
      dispatch(
        flashActions.showError('An error occurred with your attachments. Please re-upload.')
      );
      return null;
    }

    if (syncErrors) {
      setPostFailed(true);
      return null;
    }

    if (values.file.length > 0) {
      setUploading(true);

      await Promise.all(
        fileArr.map(async (_item, index) => {
          await axiosInstance
            .post(`/v1/documents`, baseFile[index], { params: documentParams(index) })
            .then(async (res) => {
              if (values.file[index].addToNoticeboard) {
                await axiosInstance
                  .post(
                    `/v1/building_profile/${encodeURIComponent(
                      values.file[index].spNumber.value
                    )}/create_noticeboard`,
                    {
                      ...noticeBoardParams(index, res)
                    }
                  )
                  .catch((error) => {
                    throw error;
                  });
              }

              const updateDocumentAttributes = updateDocumentAttrs(index);

              if (updateDocumentAttributes) {
                await axiosInstance
                  .put(`/v1/documents/${res.data.id}?${updateDocumentAttributes}`)
                  .catch((error) => {
                    throw error;
                  });
              }

              if (index === fileArr.length - 1) {
                successModalEvent();
                setUploading(false);
                setFileArr([]);

                // reset form data
                dispatch(reset(formName));

                closeModal();

                if (res.data.category === 'invoice') {
                  setTimeout(function () {
                    Router.push(`/invoice?id=${res.data.id}`);
                  }, 1000);
                } else {
                  setTimeout(function () {
                    Router.push(`/document-preview?id=${res.data.id}`);
                  }, 1000);
                }
              }
            })
            .catch((error) => {
              dispatch(flashActions.showError(error));
              setPostFailed(true);
              setUploading(false);
            });
        })
      );
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
      const nameWithoutExtension = name.substr(0, name.lastIndexOf('.')) || name;
      const extension = name.substr(name.lastIndexOf('.') + 1, name.length) || name;
      const newType = type.split('/')[1];
      // Add a key/value pair containing the base64 format of the file and push to the clonedBaseFile array
      clonedBaseFile.push({ file: promises[index] });
      // Add the path, name, size and type to the array containing all files to be uploaded
      clonedFileArray.push({
        path,
        filename: nameWithoutExtension,
        file_extension: extension,
        file_size: size,
        type: newType
      });
    });
    // Set the baseFile array to be uploaded as the clonedBaseFile array
    setBaseFile(clonedBaseFile);
    // Set the fileArray to be uploaded as the clonedFileArray
    setFileArr(clonedFileArray);
  };

  // Remove file from the fileArray , baseFile and update field values
  const removeFileHandler = (file) => {
    const newArray = [...fileArr];
    newArray.splice(file, 1);
    setFileArr(newArray);

    const newBaseFileArray = [...baseFile];
    newBaseFileArray.splice(file, 1);
    setBaseFile(newBaseFileArray);

    const newValuesFileArray = values.file;
    newValuesFileArray.splice(file, 1);
    dispatch(autofill(formName, 'file', newValuesFileArray));
  };

  // When the 'close' button is toggled
  const toggleCloseButton = (event) => {
    // If there are files waiting to be uploaded, confirm they want to close
    if (values.file.length >= 1) {
      setContinueModal(true);
    } else {
      return closeModal(event);
    }
  };

  const handleChange = async (payload, index) => {
    const { value, association_type_name } = payload;
    const fileName = values?.file[index]?.filename;
    let spNumber = values?.file[index]?.spNumber?.value || '[SP]';
    let docCategory = values?.file[index]?.docCategory?.label || '[TYPE]';

    if (association_type_name) {
      spNumber = payload.value;
      dispatch(autofill(formName, `file[${index}].spNumber`, payload));
      dispatch(autofill(formName, `file[${index}].validSpNumber`, true));
    } else {
      docCategory = payload.label;
      dispatch(autofill(formName, `file[${index}].docCategory`, payload));
    }

    const _suggestFileName = `${spNumber} - ${docCategory} - ${fileName}`;
    dispatch(autofill(formName, `file[${index}].suggestFileName`, _suggestFileName));
  };

  const handleChangeFileName = async (e, index, filename) => {
    e.preventDefault();
    if (filename) {
      dispatch(autofill(formName, `file[${index}].filename`, filename));
    }
  };

  // Send the updated fileArray to redux
  useEffect(() => {
    if (fileArr.length === baseFile.length) {
      // Include the already existing form data of other files to the file list payload
      const fileArrWithFormValues = fileArr.map((file, index) => {
        if (index < values.file.length) {
          return { ...file, ...values.file[index] };
        }
        return file;
      });

      dispatch(autofill(formName, 'file', fileArrWithFormValues));

      if (globalSpNumber && globalDocCategory) {
        fileArr?.map((file, index) => {
          const _globalSuggestFileName = `${globalSpNumber} - ${globalDocCategory} - ${file?.filename}`;
          dispatch(autofill(formName, `file[${index}].suggestFileName`, _globalSuggestFileName));
        });
      }

      if (type === 'invoice') {
        // set docCategory as invoice
        const invoiceCategory = categories.find((category) => category.value === 'invoice');
        fileArr?.map((file, index) => {
          dispatch(autofill(formName, `file[${index}].docCategory`, invoiceCategory));
        });
      }
    } else {
      setFileArr([]);
      setBaseFile([]);
    }
  }, [fileArr]);

  // Get list of active strata managers for sharing
  useEffect(() => {
    const userRole = 'strata_manager';
    const isActive = true;
    dispatch(getOrgUsers(null, userRole, isActive));
  }, []);

  return (
    <div className='file-upload-container'>
      <p className='title'>Upload {type === 'document' ? 'Document' : 'Invoice'}</p>
      <DropzoneUploader addFileHandler={addFileHandler} allowMultiple />
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
            onChangeHandler={handleChange}
            spNumbers={spNumbers}
            onClickSuggestFileName={handleChangeFileName}
            categories={filteredCategories}
            setLotNumbers={setLotNumbers}
            type={type}
          />
        </div>
        <GlobalFields
          postFailed={postFailed}
          syncErrors={syncErrors}
          values={values}
          formName={formName}
          spNumbers={spNumbers}
          categories={filteredCategories}
          type={type}
        />
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
            {!uploading ? 'Done' : 'Uploading'}
          </button>
        </div>
      </Form>
    </div>
  );
};

export const FileUpload = reduxForm({
  form: formName,
  destroyOnUnmount: false,
  initialValues: {
    file: [],
    global: {
      spNumber: null,
      docCategory: null
    }
  },
  validate
})(FileForm);
