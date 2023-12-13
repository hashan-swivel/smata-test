import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import { axiosInstance } from '../../../../utils';
import { ActionForm } from './ActionForm';
import { flashActions } from '../../../../actions';

import './CancelHoldInvoice.module.scss';

const NoPaymentRequiredForm = ({
  handleSubmit,
  submitFailed,
  closeModal,
  setKeepDropdownOpen,
  documentName,
  id,
  reloadPage,
  setProcessing
}) => {
  const newState = useSelector((state) => state.form.NoPaymentRequired);
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
      .patch(`v1/documents/${id}/invoice/mark_as_no_payment_required`, { status_note: note })
      .then(() => {
        dispatch(flashActions.showSuccess('No payment is required for this invoice'));
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
      <h3 className='cancel-hold-invoice-title'>No payment required?</h3>
      <p className='cancel-hold-invoice-text'>
        Are you sure you want to approve '{documentName}' without requiring payment?
      </p>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={textField}
        closeModal={closeModal}
        buttonText='Approve'
        actionButtonColor='green'
      />
    </div>
  );
};

export const NoPaymentRequired = reduxForm({
  form: 'NoPaymentRequired'
})(NoPaymentRequiredForm);
