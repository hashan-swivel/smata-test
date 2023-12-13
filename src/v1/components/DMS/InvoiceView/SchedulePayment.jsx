import React, { useEffect } from 'react';
import Router from 'next/router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import { autofill, reduxForm } from 'redux-form';
import * as moment from 'moment';
import { axiosInstance } from '../../../../utils';
import { flashActions } from '../../../../actions';
import { ActionForm } from './ActionForm';
import { DatePicker } from '../../Form/Fields';
import { updateCurrentDocument } from '../../../../actions/dms';

import './CancelHoldInvoice.module.scss';

const SchedulePaymentForm = ({
  submitFailed,
  handleSubmit,
  closeModal,
  documentName,
  id,
  setProcessing,
  invoice
}) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.form.schedulePayment);
  const { values, syncErrors } = formState;
  const fields = [
    {
      name: 'scheduleDate',
      label: 'Schedule the Payment Date',
      component: DatePicker,
      classNames: 'invoice-date',
      defaultDate: values?.scheduleDate
    },
    {
      name: 'reason',
      component: 'input',
      type: 'textarea',
      label: 'Please enter a note for scheduled date:',
      placeholder: 'Write your note...'
    }
  ];

  useEffect(() => {
    const scheduleDate = invoice?.schedule_date
      ? [moment.unix(invoice?.schedule_date).format('DD/MM/YYYY')]
      : null;
    dispatch(autofill('schedulePayment', 'scheduleDate', scheduleDate));
  }, [invoice?.schedule_date]);

  const onSubmit = async () => {
    setProcessing(true);
    closeModal();

    const reason = values?.reason ? values.reason : '';
    let scheduleDate;

    if (values?.scheduleDate?.[0]) {
      scheduleDate =
        typeof values?.scheduleDate?.[0] === 'object'
          ? moment(values?.scheduleDate?.[0], 'X').format('DD/MM/YYYY')
          : moment(values?.scheduleDate?.[0], 'DD/MM/YYYY').format('DD/MM/YYYY');
    } else {
      scheduleDate = '';
    }

    try {
      const params = queryString.stringify({
        reason,
        'invoice_attributes[schedule_date]': scheduleDate
      });

      await axiosInstance.put(`/v1/documents/${id}?${params}`).then((res) => {
        dispatch(updateCurrentDocument(res.data));
        dispatch(
          flashActions.showSuccess('You have scheduled payment date for this invoice successfully')
        );
      });
      setProcessing(false);
      if (invoice?.status === 'scheduled_payment') {
        Router.reload();
      }
    } catch (error) {
      dispatch(flashActions.showError(error));
      setProcessing(false);
    }
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>Are you sure wish to schedule a payment date?</h3>
      <p className='alert alert--warning'>
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
      </p>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={fields}
        closeModal={closeModal}
        buttonText='Schedule'
        actionButtonColor='green'
      />
    </div>
  );
};

export const SchedulePayment = reduxForm({
  form: 'schedulePayment',
  destroyOnUnmount: true,
  initialValues: {}
})(SchedulePaymentForm);
