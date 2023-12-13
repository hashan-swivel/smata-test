import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import { ActionForm } from './ActionForm';
import './CancelHoldInvoice.module.scss';
import { axiosInstance } from '../../../../utils';
import { flashActions } from '../../../../actions';

const ReopenInvoiceForm = ({
  handleSubmit,
  submitFailed,
  closeModal,
  setKeepDropdownOpen,
  documentName,
  id,
  reloadInvoice
}) => {
  const newFormState = useSelector((state) => state.form.ReopenInvoice);
  const dispatch = useDispatch();
  const { syncErrors } = newFormState || {};

  const onSubmit = async () => {
    setKeepDropdownOpen(false);
    closeModal();

    await axiosInstance
      .patch(`v1/documents/${id}/invoice/reopen`)
      .then(() => dispatch(flashActions.showSuccess(`You have reopened ${documentName}`)))
      .catch((error) => dispatch(flashActions.showError(error)));

    reloadInvoice(false);
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>Reopen Invoice?</h3>
      <p className='cancel-hold-invoice-text'>Are you sure you want to reopen '{documentName}'?</p>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={[]}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={[]}
        closeModal={closeModal}
        buttonText='Reopen Invoice'
        actionButtonColor='green'
      />
    </div>
  );
};

export const ReopenInvoice = reduxForm({
  form: 'ReopenInvoice'
})(ReopenInvoiceForm);
