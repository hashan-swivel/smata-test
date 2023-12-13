import React, { useState } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { inspectionDurationFormat, formatDateOnly } from '../../../utils';
import { buildingInspectionSessionActions } from '../../../actions';
import ModalContainer from '../Modals/ModalContainer';

const InspectionSessionModal = ({ item, dispatch }) => {
  const { control, handleSubmit } = useForm({ defaultValues: { category: '' } });
  const [submitting, SetSubmitting] = useState(false);

  const {
    location_name: locationName,
    start_date: startDate,
    end_date: endDate,
    maximum_duration_in_seconds: maximumDuration,
    state,
    extendable,
    chargeable,
    minimum_charge: minimumCharge,
    rate_per_minute: ratePerMinute,
    current_building_inspection_time_log: currentTimeLog,
    last_building_inspection_time_log: lastTimeLog,
    extendable_duration: extendableDuration,
    next_increment_duration_in_seconds: nextIncrementDurationInSeconds,
    charged_for_minimum_increment_duration: chargedForMinimumIncrementDuration
  } = item;

  const timeLog = currentTimeLog || lastTimeLog;

  const extendDurationOptions = () => {
    const length = parseInt(extendableDuration / 30, 10);

    return [...Array(length).keys()].map((n) => {
      const value = (n + 1) * 30;
      const label = `${value} minutes ($${(value * ratePerMinute).toFixed(2)})`;

      return { label, value };
    });
  };

  const modalTitle = () => {
    switch (state) {
      case 'ongoing':
        return 'Ongoing Inspection';
      case 'paused':
        return 'Paused Inspection';
      case 'scheduled':
        return 'Start Inspection';
      case 'stopped':
        return 'Inspection Time Expired';
      case 'expired':
        return 'Inspection Time Expired';
      default:
        return null;
    }
  };

  const onSubmit = (data) => {
    SetSubmitting(true);
    switch (state) {
      case 'ongoing':
        dispatch(buildingInspectionSessionActions.pauseInspection(item.id));
        return;
      case 'paused':
        dispatch(buildingInspectionSessionActions.resumeInspection(item.id));
        return;
      case 'scheduled':
        dispatch(buildingInspectionSessionActions.startInspection(item.id));
        return;
      case 'stopped':
        dispatch(
          buildingInspectionSessionActions.extendInspection(item.id, data?.extendDuration?.value)
        );
        return;
      default:
        return null;
    }
  };

  const modalContainer = () => {
    switch (state) {
      case 'ongoing':
        return ongoingInspectionModalContainer();
      case 'paused':
        return pausedInspectionModalContainer();
      case 'scheduled':
        return scheduledInspectionModalContainer();
      case 'stopped':
        return stoppedInspectionModalContainer();
      default:
        return null;
    }
  };

  const commonModalBody = () => (
    <div className='c-modal__body building-inspection-session-modal-container'>
      <p>
        <span>
          You have been granted access to the above buildings records for the following period of
          time:
        </span>
      </p>
      <p>
        <strong>Start Date:</strong>
        &nbsp;
        <span>{formatDateOnly(startDate)}</span>
        <br />
        <strong>Expiry Date:</strong>
        &nbsp;
        <span>{formatDateOnly(endDate)}</span>
        <br />
        <strong>Duration of time permitted:</strong>
        &nbsp;
        <span>{inspectionDurationFormat(maximumDuration)}</span>
        <br />
        <strong>Remaining duration:</strong>
        &nbsp;
        <span>{inspectionDurationFormat(timeLog?.remaining_duration)}</span>
        <br />
        <strong>Used duration:</strong>
        &nbsp;
        <span>{inspectionDurationFormat(timeLog?.calculated_used_duration)}</span>
      </p>
    </div>
  );

  const ongoingInspectionModalContainer = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      {commonModalBody()}
      <div className='c-modal__footer'>
        <button
          type='submit'
          className='button button--primary'
          disabled={submitting}
          style={{ marginLeft: '10px' }}
        >
          PAUSE INSPECTION
        </button>
      </div>
    </form>
  );

  const pausedInspectionModalContainer = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      {commonModalBody()}
      <div className='c-modal__footer'>
        <button
          type='submit'
          className='button button--primary'
          disabled={submitting}
          style={{ marginLeft: '10px' }}
        >
          RESUME INSPECTION
        </button>
      </div>
    </form>
  );

  const scheduledInspectionModalContainer = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='c-modal__body building-inspection-session-modal-container'>
        <p>
          <span>
            You have been granted access to the above buildings records for the following period of
            time:
          </span>
        </p>
        <p>
          <strong>Start Date:</strong>
          &nbsp;
          <span>{formatDateOnly(startDate)}</span>
          <br />
          <strong>Expiry Date:</strong>
          &nbsp;
          <span>{formatDateOnly(endDate)}</span>
          <br />
          <strong>Duration of time permitted:</strong>
          &nbsp;
          <span>{chargeable ? inspectionDurationFormat(maximumDuration) : 'Unlimited'}</span>
        </p>

        {chargeable && (
          <>
            <p>
              The following fees apply for accessing these records, and will be charged to your
              Credit Card once you Start your inspection:
            </p>

            <p>
              <strong>Minimum Charge:</strong>
              &nbsp;
              <span>${minimumCharge?.toFixed(2)}</span>
            </p>
          </>
        )}

        <p>
          <span>
            Once you start your access, you will have a time clock icon that appears in the top left
            corner. This will show how much time you have left in your access period.
          </span>
          <br />
          <span>
            To accept the above charges and commence your inspection please click on the "Start
            Inspection" button below.
          </span>
        </p>

        <p>
          <span>The merchant fee will be added to the total amount you need to pay.</span>
        </p>
        {chargeable && (
          <p>
            * For NSW & QLD customers, the &nbsp;
            <b>minimum charge</b>
            &nbsp; is the hourly rate for the inspection. After the first hour, you will have the
            ability to extend the inspection in 30 minute increments. For all other jurisdictions
            the &nbsp;
            <b>minimum charge</b>
            &nbsp; is the total charge for the inspection.
          </p>
        )}
      </div>
      <div className='c-modal__footer'>
        {chargeable && (
          <a href={`#`} target='_self' type='button' className='button button--link-dark'>
            UPDATE CREDIT CARD
          </a>
        )}
        <button
          type='submit'
          className='button button--primary'
          disabled={submitting}
          style={{ marginLeft: '10px' }}
        >
          START INSPECTION
        </button>
      </div>
    </form>
  );

  const stoppedInspectionModalContainer = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='c-modal__body building-inspection-session-modal-container'>
        <p>
          <span>Your initial time for the inspection has expired.</span>
          <br />
          <span>
            You are permitted to extend the inspection for a maximum of{' '}
            <span style={{ color: 'red' }}>
              {inspectionDurationFormat(nextIncrementDurationInSeconds)}
            </span>
          </span>
          <br />
          <span>
            The following fees apply for continuing to access these records, and will be charged to
            your Credit Card once you extend your inspection
          </span>
          <br />
        </p>
        <div style={{ marginBottom: '15px' }}>
          <strong>Charged in increments of 30 Minutes:</strong>
          &nbsp;
          <span>${chargedForMinimumIncrementDuration.toFixed(2)}</span>
          <div className='form__group'>
            <div className='form__control' style={{ display: 'inline-block' }}>
              <label htmlFor='extendDuration'>I wish to extend my inspection by:</label>
            </div>
            &nbsp;
            <div
              className='react-select-field form__control'
              style={{ display: 'inline-block', width: '200px' }}
            >
              <Controller
                name='extendDuration'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={extendDurationOptions()}
                    classNamePrefix='react-select'
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    menuPortalTarget={
                      typeof window !== 'undefined' ? document.getElementById('__next') : null
                    }
                  />
                )}
              />
            </div>
          </div>
        </div>

        <span>
          To accept the above charges and continue your inspection please click on the "Extend
          Inspection" button below.
        </span>
      </div>

      <div className='c-modal__footer'>
        {!extendable ? (
          <button
            type='submit'
            className='button button--primary'
            disabled
            style={{ marginLeft: '10px' }}
          >
            EXTEND INSPECTION
          </button>
        ) : chargeable ? (
          <>
            <a href={`#`} target='_self' type='button' className='button button--link-dark'>
              UPDATE CREDIT CARD
            </a>
            <button
              type='submit'
              className='button button--primary'
              disabled={submitting}
              style={{ marginLeft: '10px' }}
            >
              EXTEND INSPECTION
            </button>
          </>
        ) : (
          <button
            type='submit'
            className='button button--primary'
            disabled={submitting}
            style={{ marginLeft: '10px' }}
          >
            EXTEND INSPECTION
          </button>
        )}
      </div>
    </form>
  );

  return (
    <ModalContainer
      title={modalTitle()}
      reactModalProps={{ className: 'c-modal__container c-modal__container--lg' }}
    >
      <p style={{ textAlign: 'center' }}>{locationName}</p>
      {modalContainer()}
    </ModalContainer>
  );
};

export default connect((state) => state.buildingInspectionSessions)(InspectionSessionModal);
