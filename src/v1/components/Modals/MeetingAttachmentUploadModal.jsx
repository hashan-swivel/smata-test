import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { useFieldArray, useForm } from 'react-hook-form';
import { FileType } from '../index';
import { authHeader } from '../../../helpers';
import { flashActions, modalActions } from '../../../actions';
import { getFileExtension, humanizeFileSize, chunk, axiosInstance } from '../../../utils';
import ModalContainer from './ModalContainer';
import Dropzone from '../Shared/Dropzone';

import './MeetingAttachmentUploadModal.module.scss';

const MeetingAttachmentUploadModal = ({ dispatch, meeting_register_id, handleAfterClose }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors }
  } = useForm({
    defaultValues: {
      attachments: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'attachments',
    control
  });

  React.useEffect(() => {
    if (fields && fields.length <= 1) setValue('global', false);
  }, [fields]);

  const handleDropAccepted = (acceptedFiles) => {
    acceptedFiles.forEach((f) =>
      append({
        title: f.path,
        file: f,
        meeting_register_id,
        uploaded: false
      })
    );
  };

  const onSubmit = async (data) => {
    const headers = authHeader({ 'Content-Type': 'multipart/form-data' });
    let fails = [];

    let lastId = null;

    const upload = async (item) => {
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('attachment', item.file);
      formData.append('meeting_register_id', item.meeting_register_id);

      await axiosInstance
        .post('/v1/meeting_register_attachments', formData, { headers })
        .then((res) => {
          lastId = res.data.id;
        })
        .catch((err) => {
          fails = [
            ...fails,
            {
              status: 'error',
              errorMessage: flashActions.errorMessage(err)
            }
          ];
        });
    };

    const batches = chunk(data.attachments, 1); // [[item1], [item2], ..., [item12]]

    while (batches.length) {
      const batch = batches.shift();
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map((promiseItem) => upload(promiseItem)));
    }

    if (fails.length === 0) {
      dispatch(modalActions.hideModal());
    } else {
      dispatch(
        flashActions.showError(
          'Some of the documents failed create. Please review them individually.'
        )
      );
    }
  };

  const fileUploadItems = () => {
    return (
      <div className='upload-items'>
        {fields.map((field, index) => (
          <div key={field.id} className='upload-item'>
            <div className='upload-item--media'>
              <FileType type={getFileExtension(field.file?.path)} />
              <div className='upload-item--name-and-size'>
                <h5 className='upload-item--name'>{field.file?.path}</h5>
                <span className='upload-item--size'>
                  {humanizeFileSize(field.file?.size, true)}
                </span>
              </div>
              {!isSubmitting && (
                <button
                  type='button'
                  className='button button--link-dark'
                  onClick={() => remove(index)}
                  style={{ padding: 0 }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor={`attachments.${index}.title`}>Display Name</label>
              </div>
              <input
                className='form__control'
                {...register(`attachments.${index}.title`, { required: 'Can not be blank.' })}
                type='text'
                name={`attachments.${index}.title`}
              />
              {errors?.attachments?.[index]?.title && (
                <div className='invalid-feedback'>{errors.attachments[index].title.message}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ModalContainer
      title='Upload Meeting Documents'
      reactModalProps={{
        onAfterClose: handleAfterClose,
        shouldCloseOnOverlayClick: false,
        shouldCloseOnEsc: false,
        className: 'c-modal__container c-modal__container--lg bulk-update-priority'
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting}>
          <div className='c-modal__body'>
            {fileUploadItems()}
            <Dropzone handleDropAccepted={handleDropAccepted} />
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
            {fields && fields.length !== 0 && (
              <button
                type='submit'
                className='button button--primary'
                style={{ marginLeft: '10px', minWidth: '100px' }}
              >
                Upload
              </button>
            )}
          </div>
        </fieldset>
      </form>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(MeetingAttachmentUploadModal);
