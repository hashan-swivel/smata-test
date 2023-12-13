import React, { useState } from 'react';

import Flatpickr from 'react-flatpickr';
import * as moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { datetimeConstants } from '../../../../constants';
import { axiosInstance, currentTimeInShortFormat } from '../../../../utils';
import { flashActions } from '../../../../actions';
import { authHeader } from '../../../../helpers';

import './DigitalNoticeboard.module.scss';

export const NewsForm = ({ currentUser, dispatch, noticeboard, screenId, onAfterSubmit }) => {
  const d = new Date();
  const today = d.toLocaleDateString('en-GB');
  d.setDate(d.getDate() + 1);
  const tomorrow = d.toLocaleDateString('en-GB');
  const editing = !!noticeboard?.id;

  const defaultValues = {
    heading: noticeboard?.heading,
    main_copy: noticeboard?.main_copy,
    start_at: noticeboard?.start_at
      ? moment.unix(noticeboard.start_at).format(datetimeConstants.FORMAT.DEFAULT)
      : today,
    end_at: noticeboard?.end_at
      ? moment.unix(noticeboard.end_at).format(datetimeConstants.FORMAT.DEFAULT)
      : tomorrow
  };
  const defaultDate = [defaultValues.start_at, defaultValues.end_at];

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    control,
    setValue
  } = useForm({
    defaultValues
  });

  const initializePreviewImage = noticeboard.image?.length ? noticeboard.image : null;
  const [previewImage, setPreviewImage] = useState(initializePreviewImage);

  const handleImageChanged = (e) => {
    if (e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    } else {
      setPreviewImage(initializePreviewImage);
    }
  };

  const onSubmitAsDraft = (data) => {
    data.draft = true;
    onSubmit(data);
  };

  const onSubmit = async (data) => {
    const headers = authHeader({ 'Content-Type': 'multipart/form-data' });
    const formData = new FormData();
    formData.append('heading', data.heading);
    formData.append('main_copy', data.main_copy);
    formData.append('draft', data.draft || false);
    formData.append(
      'start_at',
      data.time_frame ? data.time_frame[0].toLocaleDateString('en-GB') : today
    );
    formData.append(
      'end_at',
      data.time_frame ? data.time_frame[1].toLocaleDateString('en-GB') : tomorrow
    );
    if (!data.remove_image && data.image.length !== 0) {
      formData.append('image', data.image[0]);
    }

    if (editing) {
      await axiosInstance
        .put(`/v1/digital_noticeboards/${noticeboard.id}`, formData, { headers })
        .then(() => onAfterSubmit())
        .catch((error) => dispatch(flashActions.showError(error)));
    } else {
      formData.append(
        'digital_noticeboard_template_id',
        noticeboard?.digital_noticeboard_template_id
      );
      formData.append('digital_noticeboard_screen_id', screenId);
      await axiosInstance
        .post(`/v1/digital_noticeboards`, formData, { headers })
        .then(() => onAfterSubmit())
        .catch((error) => dispatch(flashActions.showError(error)));
    }
  };

  return (
    <div className='digital-noticeboard-container'>
      <div className='digital-noticeboard-preview-container'>
        <div className='digital-noticeboard-preview'>
          <div className='digital-noticeboard-preview__header'>
            <div className='digital-noticeboard-preview__header--left'>
              <img src='/building-message-news.png' alt='Building Message' />
            </div>
            <div className='digital-noticeboard-preview__header--right'>
              <img
                className='digital-noticeboard-preview__logo'
                src={currentUser.theme?.logo}
                alt='Logo'
              />
            </div>
          </div>
          <div className='digital-noticeboard-preview__content'>
            <div className='digital-noticeboard-preview__news-image-placeholder'>
              {previewImage !== null ? (
                <img
                  className='digital-noticeboard-preview__news-image'
                  src={previewImage}
                  alt='Preview'
                />
              ) : (
                <span>IMAGE</span>
              )}
            </div>
            <div className='digital-noticeboard-preview__message-box--news digital-noticeboard-preview__message-box--primary'>
              <h1 className='digital-noticeboard-preview__heading-text'>{watch('heading')}</h1>
              <span className='digital-noticeboard-preview__main-copy-text'>
                {watch('main_copy')}
              </span>
            </div>
          </div>

          <div className='digital-noticeboard-preview__footer'>
            <div className='digital-noticeboard-preview__footer digital-noticeboard-preview__footer--left'>
              <span className='digital-noticeboard-preview__footer digital-noticeboard-preview__clock'>
                {currentTimeInShortFormat()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='digital-noticeboard-form-container'>
        <div className='digital-noticeboard-form'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting}>
              <div className='form__group'>
                <div className='form__control'>
                  <label htmlFor='image'>Image</label>
                </div>
                <input
                  className='form__control'
                  {...register('image')}
                  type='file'
                  name='image'
                  id='digital-noticeboard-image'
                  onChange={handleImageChanged}
                />
              </div>
              {editing && noticeboard.image?.length && (
                <div className='form__group'>
                  <div className='form__control'>
                    <label
                      className='checkbox-container'
                      htmlFor='digital-noticeboard-remove-image'
                    >
                      Remove Image
                      <input
                        {...register('remove_image')}
                        type='checkbox'
                        id='digital-noticeboard-remove-image'
                        name='remove_image'
                      />
                      <span className='checkmark' />
                    </label>
                  </div>
                </div>
              )}
              <div className='form__group'>
                <div className='form__control'>
                  <label htmlFor='heading'>Heading</label>
                </div>
                <input
                  className='form__control'
                  {...register('heading')}
                  required
                  type='text'
                  name='heading'
                  id='digital-noticeboard-heading'
                />
              </div>
              <div className='form__group'>
                <div className='form__control'>
                  <label htmlFor='main_copy'>Description</label>
                </div>
                <textarea
                  className='form__control'
                  {...register('main_copy')}
                  required
                  name='main_copy'
                  id='digital-noticeboard-main-copy'
                />
              </div>

              <div className='form__group'>
                <div className='form__control'>
                  <label htmlFor='time_frame'>Time Frame</label>
                </div>
                <Controller
                  control={control}
                  {...register(`time_frame`)}
                  render={() => (
                    <Flatpickr
                      options={{
                        dateFormat: 'd/m/Y',
                        mode: 'range',
                        minDate: editing ? null : 'today',
                        defaultDate,
                        allowInput: false
                      }}
                      onChange={(selectedDates, _dateStr, _instance) => {
                        setValue(`time_frame`, selectedDates);
                      }}
                    />
                  )}
                />
              </div>

              <div className='form__group footer'>
                <button
                  type='button'
                  className='button button--primary'
                  disabled={isSubmitting}
                  style={{ minWidth: '100px' }}
                  onClick={handleSubmit(onSubmitAsDraft)}
                >
                  SAVE DRAFT
                </button>
                <button
                  type='submit'
                  className='button button--primary'
                  disabled={isSubmitting}
                  style={{ marginLeft: '10px', minWidth: '100px' }}
                >
                  SAVE
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};
