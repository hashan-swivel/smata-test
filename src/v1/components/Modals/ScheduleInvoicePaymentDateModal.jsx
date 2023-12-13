import React, { useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import { Controller, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import * as moment from 'moment';
import ModalContainer from './ModalContainer';
import { flashActions, modalActions } from '../../../actions';
import { datetimeConstants } from '../../../constants';
import { axiosInstance } from '../../../utils';

const ScheduleInvoicePaymentDateModal = ({ dispatch, id, invoice }) => {
  const scheduleDateFp = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm({
    defaultValues: {
      schedule_date: invoice?.schedule_date ? [new Date(invoice?.schedule_date * 1000)] : null,
      status_note: null
    }
  });

  const onSubmit = async (data) => {
    const params = {
      schedule_date: data.schedule_date?.[0]
        ? moment(data.schedule_date?.[0], datetimeConstants.FORMAT.DEFAULT).format(
            datetimeConstants.FORMAT.DEFAULT
          )
        : null,
      status_note: data.status_note,
      commit: 'schedule_payment'
    };

    await axiosInstance
      .patch(`v1/documents/${id}/invoice/update_status`, params)
      .then(() => {
        dispatch(flashActions.showSuccess('Payment Date has been updated'));
        Router.reload();
      })
      .catch((error) => {
        dispatch(flashActions.showError(error));
      });
  };

  return (
    <ModalContainer
      title='Schedule Payment Date'
      dismissible={!isSubmitting}
      reactModalProps={{
        shouldCloseOnOverlayClick: false,
        shouldCloseOnEsc: false,
        className: 'c-modal__container'
      }}
    >
      <div className='c-modal__body'>
        <div className='alert alert--warning'>
          <strong>WARNING:</strong>
          <ul>
            <li className='list-style-inside'>
              Scheduling a payment date will export this invoice to Strata Master on that date,
              provided it is approved as per the Invoice Rules.
            </li>
            <li className='list-style-inside'>
              An invoice that is scheduled for payment will only reflect as a liability on Strata
              Master financial statements or status certificates once the invoice is approved by all
              required approvers and the scheduled date is passed.
            </li>
          </ul>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isSubmitting}>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='schedule_date'>Payment Date</label>
              </div>
              <div className='form__control' style={{ position: 'relative' }}>
                <Controller
                  name='schedule_date'
                  control={control}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <Flatpickr
                      {...fieldProps}
                      options={{ dateFormat: 'd/m/Y', mode: 'single', minDate: 'today' }}
                      ref={scheduleDateFp}
                    />
                  )}
                />
                <button
                  type='button'
                  className='form__control__icon icon-cross-red'
                  style={{
                    background: 'none',
                    border: 'none',
                    top: '13px',
                    right: '10px',
                    position: 'absolute',
                    display: 'flex',
                    fontSize: '16px'
                  }}
                  onClick={() => {
                    if (scheduleDateFp?.current?.flatpickr) {
                      scheduleDateFp.current.flatpickr.clear();
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} color='#DE6560' />
                </button>
              </div>
              {errors.schedule_date && (
                <div className='invalid-feedback'>{errors.schedule_date.message}</div>
              )}
            </div>
            <div className='form__group'>
              <div className='form__control'>
                <label htmlFor='status_note'>Note</label>
              </div>
              <textarea
                className='form__control custom-height'
                {...register('status_note')}
                placeholder='Your note'
              />
            </div>
            <div className='footer' style={{ textAlign: 'right' }}>
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
                Schedule
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </ModalContainer>
  );
};

export default connect((state) => state.modal)(ScheduleInvoicePaymentDateModal);
