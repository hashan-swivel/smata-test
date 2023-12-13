import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import { updateDocumentStatus } from '../../../../actions/dms';
import { ActionForm } from './ActionForm';
import './CancelHoldInvoice.module.scss';
import { flashActions } from '../../../../actions';

const OnHoldForm = ({
  handleSubmit,
  submitFailed,
  closeModal,
  setKeepDropdownOpen,
  documentName,
  id,
  reloadPage,
  setProcessing
}) => {
  const newState = useSelector((state) => state.form.OnHold);
  const { values, syncErrors } = newState || {};

  const dispatch = useDispatch();

  const textField = [
    {
      name: 'note',
      component: 'input',
      type: 'textarea',
      label:
        'Add a note for this action which will be displayed in the Document History for future reference:',
      placeholder: 'Write your message...'
    }
  ];

  const onSubmit = async () => {
    setProcessing(true);
    setKeepDropdownOpen(false);
    closeModal();
    const note = values && values.note ? values.note : '';
    try {
      await dispatch(updateDocumentStatus(documentName, id, 'on_hold', note));
      setProcessing(false);
      dispatch(flashActions.showSuccess('The invoice has been placed on hold'));
      reloadPage();
    } catch (error) {
      setProcessing(false);
      dispatch(flashActions.showError(error));
    }
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>
        Are you sure wish to place this invoice On Hold?
      </h3>
      <div className='alert alert--warning'>
        <strong>WARNING:</strong>
        &nbsp;If you place an invoice on hold it will not reflect as a liability on Strata Master
        financial statements or status certificates.
      </div>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={textField}
        closeModal={closeModal}
        buttonText='Place on hold'
        actionButtonColor='green'
      />
    </div>
  );
};

export const OnHold = reduxForm({
  form: 'OnHold'
})(OnHoldForm);
