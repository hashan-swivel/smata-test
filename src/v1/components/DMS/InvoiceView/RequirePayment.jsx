import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import { axiosInstance } from '../../../../utils';
import { ActionForm } from './ActionForm';
import { flashActions } from '../../../../actions';

import './CancelHoldInvoice.module.scss';

const RequirePaymentForm = ({
  handleSubmit,
  submitFailed,
  closeModal,
  setKeepDropdownOpen,
  documentName,
  id,
  reloadPage,
  setProcessing
}) => {
  const newState = useSelector((state) => state.form.RequirePayment);
  const { values, syncErrors } = newState || {};
  const dispatch = useDispatch();

  const textField = [
    {
      name: 'note',
      component: 'input',
      type: 'textarea',
      label:
        'Add a note for this action which will be displayed in the Document History for future reference:',
      placeholder: 'Write your note...'
    }
  ];

  const onSubmit = async () => {
    setKeepDropdownOpen(false);
    setProcessing(true);
    closeModal();

    const note = values && values.note ? values.note : '';

    await axiosInstance
      .patch(`v1/documents/${id}/invoice/mark_as_payment_required`, { status_note: note })
      .then(() => {
        dispatch(flashActions.showSuccess('Payment has been required for this invoice'));
        setProcessing(false);
        reloadPage();
      })
      .catch((error) => {
        dispatch(flashActions.showError(error));
        setProcessing(false);
      });
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>Require payment?</h3>
      <p className='cancel-hold-invoice-text'>
        Are you sure you want to require payment for '{documentName}'?
      </p>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={textField}
        closeModal={closeModal}
        buttonText='Require'
        actionButtonColor='green'
      />
    </div>
  );
};

export const RequirePayment = reduxForm({
  form: 'RequirePayment'
})(RequirePaymentForm);
