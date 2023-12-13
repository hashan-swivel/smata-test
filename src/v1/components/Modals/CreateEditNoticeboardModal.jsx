import React, { useState } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { connect, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Tooltip } from 'react-tippy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { flashActions, inAppNoticeboardActions, modalActions } from '../../../actions';
import { axiosInstance } from '../../../utils';
import ModalContainer from './ModalContainer';
import NoticeboardFileUpload from '../BuildingProfile/NoticeboardFileUpload';
import { documentConstants, inAppNoticeboardConstants } from '../../../constants';
import RichTextEditor from '../Form/Fields/RichTextEditor';
import { authHeader } from '../../../helpers';
import Dropzone from '../Shared/Dropzone';

import '../Form/Fields/ReactSelect.module.scss';
import './CreateEditNoticeboardModal.module.scss';

const CreateEditNoticeboardModal = ({ dispatch, noticeboard, buildingProfile }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const editing = !!noticeboard;
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors }
  } = useForm({
    defaultValues: {
      title: editing ? noticeboard.title : '',
      notice_type: editing
        ? {
            value: noticeboard.type,
            label: noticeboard.type[0].toUpperCase() + noticeboard.type.slice(1)
          }
        : null,
      text: editing ? noticeboard.text : '',
      existing_document: editing
        ? { value: noticeboard?.attachment?.id, label: noticeboard?.attachment?.name }
        : null
    }
  });

  const [coverImages, setCoverImages] = useState([]);
  const newDocument = useSelector((state) => state.form.noticeboardFileUpload);
  const watchedType = watch('notice_type');
  const watchedExistingDocument = watch('existing_document');

  const loadDocuments = (inputValue, callback) => {
    setTimeout(() => {
      const basePath = currentUser?.document_permissions?.['document.view_all']
        ? '/v1/documents/organisation_documents'
        : '/v1/documents';

      const params = {
        is_invoice: false,
        organisation_id: currentUser?.organisation_id,
        sp_number: buildingProfile ? buildingProfile?.site_plan_id?.toLowerCase() : null,
        q: inputValue && inputValue.length > 0 ? inputValue : null,
        scope: currentUser?.document_permissions?.['document.view_all'] ? 'all' : null
      };

      axiosInstance
        .get(basePath, { params })
        .then((res) =>
          callback(res.data.documents.map((doc) => ({ value: doc.id, label: doc.display_name })))
        )
        .catch((error) => {
          dispatch(flashActions.showError(error));
          callback([]);
        });
    }, 1000);
  };

  const onSubmit = async (data) => {
    if (!validation()) return;

    let newDocumentId = null;
    if (newDocument?.values?.baseFile) {
      const newDocumentBody = {
        file: newDocument?.values?.baseFile,
        filename: `${newDocument?.values?.file?.path}`.replace(/[/\\?%*:|"<>\s+]/g, '-'),
        category: newDocument?.values?.docCategory,
        sp_number: buildingProfile?.site_plan_id
      };

      await axiosInstance
        .post(documentConstants.BASE_PATH, newDocumentBody)
        .then((res) => {
          newDocumentId = res.data.id;
        })
        .catch((error) => dispatch(flashActions.showError(error)));
    }

    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.text && data.text !== '<p><br></p>') formData.append('text', data.text);
    if (coverImages[0]) formData.append('cover_image', coverImages[0]);
    formData.append('notice_type', data?.notice_type?.value);

    let attachment_id = null;
    if (watchedType?.value === 'document') {
      if (newDocumentId) {
        attachment_id = newDocumentId;
      } else {
        attachment_id = data?.existing_document?.value;
      }
    }
    formData.append('attachment_id', attachment_id);
    const headers = authHeader({ 'Content-Type': 'multipart/form-data' });

    if (editing) {
      formData.append('noticeboard_id', noticeboard.id);

      await axiosInstance
        .put(
          `/v1/building_profile/${encodeURIComponent(
            buildingProfile?.site_plan_id
          )}/update_noticeboard`,
          formData,
          { headers }
        )
        .then(() => {
          dispatch(flashActions.showSuccess('Done'));
          dispatch(
            inAppNoticeboardActions.getInAppNoticeboards({
              spNumber: buildingProfile?.site_plan_id
            })
          );
          dispatch(modalActions.hideModal());
        })
        .catch((error) => dispatch(flashActions.showError(error)));
    } else {
      await axiosInstance
        .post(
          `/v1/building_profile/${encodeURIComponent(
            buildingProfile?.site_plan_id
          )}/create_noticeboard`,
          formData,
          { headers }
        )
        .then(() => {
          dispatch(flashActions.showSuccess('Done'));
          dispatch(
            inAppNoticeboardActions.getInAppNoticeboards({
              spNumber: buildingProfile?.site_plan_id
            })
          );
          dispatch(modalActions.hideModal());
        })
        .catch((error) => dispatch(flashActions.showError(error)));
    }
  };

  const handleCoverImageDropAccepted = (acceptedFiles) => {
    setCoverImages(acceptedFiles);
  };

  const validation = () => {
    if (watchedType?.value === 'document') {
      if (!watchedExistingDocument) {
        if (newDocument?.values?.baseFile) {
          if (!newDocument?.values?.docCategory) {
            dispatch(flashActions.show('Category can not be blank', 'error'));
            return false;
          }
          if (!newDocument?.values?.filename) {
            dispatch(flashActions.show('Display filename can not be blank', 'error'));
            return false;
          }
        } else {
          dispatch(flashActions.show('Document must be present', 'error'));
          return false;
        }
      }
    }

    return true;
  };

  return (
    <ModalContainer
      title={noticeboard ? 'Edit Noticeboard' : 'New Noticeboard'}
      reactModalProps={{
        shouldCloseOnOverlayClick: false,
        className: 'c-modal__container c-modal__container--lg create-noticeboard-modal'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting} className='fieldset'>
          <div className='c-modal__body'>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='cover_image'>Cover Image</label>
              </div>
              <div className='form__control'>
                <Dropzone
                  options={{ accept: { '*/*': ['.png', '.jpg', '.jpeg'] }, multiple: false }}
                  handleDropAccepted={handleCoverImageDropAccepted}
                />
              </div>
              {coverImages.map((file) => (
                <li key={file.path}>
                  {file.path} - {file.size} bytes
                </li>
              ))}
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='title'>Title</label>
              </div>
              <input
                className='form__control input'
                {...register('title', { required: 'Can not be blank' })}
                type='text'
                name='title'
                id='noticeboard-title'
                placeholder='Noticeboard Title'
              />
              {errors.title && <div className='invalid-feedback'>{errors.title.message}</div>}
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='notice_type'>Type</label>
              </div>
              <div className='form__control'>
                <Controller
                  name='notice_type'
                  control={control}
                  rules={{ required: 'Can not be blank' }}
                  render={({ field: { onChange, value, ref, ..._rest } }) => (
                    <Select
                      inputRef={ref}
                      options={inAppNoticeboardConstants.NOTICE_BOARD_TYPE_OPTIONS}
                      classNamePrefix='react-select'
                      styles={{ menuPortal: (base) => ({ ...base }) }}
                      placeholder='Select Noticeboard Type'
                      value={value}
                      onChange={(v) => onChange(v)}
                      blurInputOnSelect
                    />
                  )}
                />
              </div>
              {errors.notice_type && (
                <div className='invalid-feedback'>{errors.notice_type.message}</div>
              )}
            </div>
            {watchedType?.value === 'document' && (
              <>
                <div className='form__group'>
                  <div className='form__control'>
                    <label htmlFor='document'>Document</label>
                    <Tooltip
                      title='Document must be saved in the Document Management System before it can be added to the Noticeboard'
                      position='bottom'
                      animation='fade'
                      theme='light'
                      arrow
                      style={{ marginLeft: '5px' }}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </Tooltip>
                  </div>
                  <div className='form__control'>
                    <Controller
                      name='existing_document'
                      control={control}
                      render={({ field: { onChange, value, ref, ..._rest } }) => (
                        <AsyncSelect
                          inputRef={ref}
                          cacheOptions
                          loadOptions={loadDocuments}
                          defaultOptions
                          classNamePrefix='react-select'
                          styles={{ menuPortal: (base) => ({ ...base }) }}
                          onChange={(v) => onChange(v)}
                          value={value}
                          blurInputOnSelect
                          placeholder='Select Document'
                        />
                      )}
                    />
                  </div>
                </div>
                <div className='horizontal-separator'>
                  <hr />
                  <span>or</span>
                </div>
                <NoticeboardFileUpload />
              </>
            )}
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='text'>Text</label>
              </div>
              <div className='form_control'>
                <Controller
                  name='text'
                  control={control}
                  render={({ field: { onChange, value, ref, ..._rest } }) => (
                    <RichTextEditor inputRef={ref} value={value} onChange={(v) => onChange(v)} />
                  )}
                />
              </div>
            </div>
          </div>
          <div className='c-modal__footer'>
            <button
              type='button'
              className='button button--link-dark'
              disabled={isSubmitting}
              onClick={() => dispatch(modalActions.hideModal())}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='button button--primary'
              style={{ marginLeft: '10px', minWidth: '100px' }}
            >
              {noticeboard ? 'Edit' : 'Add'}
            </button>
          </div>
        </fieldset>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(CreateEditNoticeboardModal);
