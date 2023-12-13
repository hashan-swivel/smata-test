import { useState } from 'react';
import * as moment from 'moment';
import Flatpickr from 'react-flatpickr';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  axiosInstance,
  currentTimeInShortFormat,
  menuPortalTarget,
  getOrdinal
} from '../../../../utils';
import { digitalNoticeboardActions, flashActions, modalActions } from '../../../../actions';
import { datetimeConstants } from '../../../../constants';
import { authHeader } from '../../../../helpers';

import 'flatpickr/dist/themes/material_green.css';
import './DigitalNoticeboard.module.scss';
// import Select from 'react-select';

const EventsForm = ({ currentUser, dispatch, noticeboard, buildingProfile, onAfterSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      digital_noticeboard_fields: [
        {
          heading: 'EVENT HEADING',
          description: 'Event Description',
          location: 'Event Location',
          date: '05/01/2023',
          time: 'Event Time'
        }
      ]
    }
  });
  const { fields } = useFieldArray({
    name: 'digital_noticeboard_fields',
    control
  });

  const [submitting, setSubmitting] = useState(false);
  // const initializePreviewImage = noticeboard.image?.length ? noticeboard.image : '/digital-noticeboard-wide-image-placeholder.png';
  const initializePreviewImage = '/digital-noticeboard-narrow-image-placeholder.png';

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('account_id', buildingProfile?.id);
    formData.append(
      'digital_noticeboard_template_id',
      noticeboard?.digital_noticeboard_template_id
    );

    data.digital_noticeboard_fields.forEach((item, index) => {
      formData.append(`event${index + 1}_heading`, item.heading);
      formData.append(`event${index + 1}_description`, item.description);
      formData.append(`event${index + 1}_location`, item.location);
      formData.append(`event${index + 1}_date`, item.date);
      formData.append(`event${index + 1}_time`, item.time);
      formData.append(`event${index + 1}_image`, item.image[0]);
      // formData.append('main_copy', data.main_copy);
      // formData.append('digital_noticeboard_template_id', noticeboard?.digital_noticeboard_template_id);
      // formData.append('account_id', buildingProfile?.id);
      // formData.append('image', item.image[0]);
    });

    await axiosInstance
      .post(`/v1/digital_noticeboards`, formData, {
        headers: authHeader({ 'Content-Type': 'multipart/form-data' })
      })
      .then(() => onAfterSubmit())
      .catch((error) => dispatch(flashActions.showError(error)));

    setSubmitting(false);
  };

  return (
    <div className='digital-noticeboard-container'>
      <div className='digital-noticeboard-preview-container'>
        <div className='digital-noticeboard-preview'>
          <div className='digital-noticeboard-preview__header'>
            <div className='digital-noticeboard-preview__header--left'>
              <img src='/building-event-guild.png' alt='Building Message' />
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
            {fields.map((field, index) => {
              const date = watch(`digital_noticeboard_fields.${index}.date`);
              const formattedDate = moment(date, datetimeConstants.FORMAT.DEFAULT).format(
                'MMM D YY'
              );
              const month = formattedDate.split(' ')[0];
              const day = formattedDate.split(' ')[1];
              const weekDay = new Date(
                moment(date, datetimeConstants.FORMAT.DEFAULT).format('MM/DD/YYYY')
              ).toLocaleString('en-us', { weekday: 'long' });

              const imageFile = watch(`digital_noticeboard_fields.${index}.image`);
              let image = initializePreviewImage;
              if (imageFile && imageFile[0]) {
                image = URL.createObjectURL(imageFile[0]);
              }

              return (
                <div className='digital-noticeboard-preview__event-box' key={field.id}>
                  <div className='digital-noticeboard-preview__event-date'>
                    <div className='digital-noticeboard-preview__event-month'>{month}</div>
                    <div className='digital-noticeboard-preview__event-day-of-month'>
                      {day}
                      <sup>{getOrdinal(day)}</sup>
                    </div>
                  </div>
                  <div className='digital-noticeboard-preview__event-information-container'>
                    <div className='digital-noticeboard-preview__event-information'>
                      <div className='digital-noticeboard-preview__event-time'>
                        {watch(`digital_noticeboard_fields.${index}.time`)}
                      </div>
                      <div className='digital-noticeboard-preview__event-week-day'>{weekDay}</div>
                      <h1 className='digital-noticeboard-preview__event-heading'>
                        {watch(`digital_noticeboard_fields.${index}.heading`)}
                      </h1>
                      <div className='digital-noticeboard-preview__event-description'>
                        {watch(`digital_noticeboard_fields.${index}.description`)}
                      </div>
                      <div className='digital-noticeboard-preview__event-location'>
                        <div className='marker' />
                        <div className='digital-noticeboard-preview__event-location-text'>
                          {watch(`digital_noticeboard_fields.${index}.location`)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='digital-noticeboard-preview__event-image'>
                    <img src={image} alt='Preview' />
                  </div>
                </div>
              );
            })}
          </div>

          <div className='digital-noticeboard-preview__footer'>
            <div className='digital-noticeboard-preview__footer digital-noticeboard-preview__footer--left'>
              <span className='digital-noticeboard-preview__footer digital-noticeboard-preview__clock'>
                {currentTimeInShortFormat()}
              </span>
            </div>
            {/*<div className="digital-noticeboard-preview__footer digital-noticeboard-preview__footer--right" />*/}
          </div>
        </div>
      </div>
      <div className='digital-noticeboard-form-container'>
        <div className='digital-noticeboard-form digital-noticeboard-events-form'>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <fieldset disabled={submitting} key={field.id}>
                <legend>Event {index + 1}</legend>
                <div className='form__group'>
                  <div className='form__control'>
                    <label htmlFor={`digital_noticeboard_fields.${index}.heading`}>Heading</label>
                  </div>
                  <input
                    className='form__control'
                    {...register(`digital_noticeboard_fields.${index}.heading`)}
                    required
                    type='text'
                    name={`digital_noticeboard_fields.${index}.heading`}
                    id={`digital-noticeboard-heading-${index}`}
                  />
                </div>
                <div className='form__group'>
                  <div className='form__control'>
                    <label htmlFor={`digital_noticeboard_fields.${index}.description`}>
                      Description
                    </label>
                  </div>
                  <textarea
                    className='form__control'
                    {...register(`digital_noticeboard_fields.${index}.description`)}
                    required
                    name={`digital_noticeboard_fields.${index}.description`}
                    id={`digital-noticeboard-description-${index}`}
                  />
                </div>
                <div className='form__group'>
                  <div className='form__control'>
                    <label htmlFor={`digital_noticeboard_fields.${index}.location`}>Location</label>
                  </div>
                  <input
                    className='form__control'
                    {...register(`digital_noticeboard_fields.${index}.location`)}
                    required
                    type='text'
                    name={`digital_noticeboard_fields.${index}.location`}
                    id={`digital-noticeboard-location-${index}`}
                  />
                </div>
                <div className='form__group'>
                  <div className='form__control'>
                    <label htmlFor={`digital_noticeboard_fields.${index}.date`}>Date</label>
                  </div>
                  <Controller
                    control={control}
                    {...register(`digital_noticeboard_fields.${index}.date`)}
                    render={({ field: { onChange, value } }) => (
                      <Flatpickr
                        options={{ dateFormat: 'd/m/Y' }}
                        value={value}
                        onChange={(_selectedDates, dateStr, _instance) => {
                          setValue(`digital_noticeboard_fields.${index}.date`, dateStr);
                        }}
                      />
                    )}
                  />
                </div>
                <div className='form__group'>
                  <div className='form__control'>
                    <label htmlFor={`digital_noticeboard_fields.${index}.time`}>Time</label>
                  </div>
                  <input
                    className='form__control'
                    {...register(`digital_noticeboard_fields.${index}.time`)}
                    type='text'
                    name={`digital_noticeboard_fields.${index}.time`}
                    id={`digital-noticeboard-time-${index}`}
                  />
                </div>
                <div className='form__group'>
                  <div className='form__control'>
                    <label htmlFor={`digital_noticeboard_fields.${index}.image`}>Image</label>
                  </div>
                  <input
                    className='form__control'
                    {...register(`digital_noticeboard_fields.${index}.image`)}
                    required
                    type='file'
                    name={`digital_noticeboard_fields.${index}.image`}
                    id='digital-noticeboard-image'
                  />
                </div>
              </fieldset>
            ))}
            <div className='form__group footer'>
              <button
                type='submit'
                className='button button--primary'
                disabled={submitting}
                style={{ marginLeft: '10px', minWidth: '100px' }}
              >
                {noticeboard?.id ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventsForm;
