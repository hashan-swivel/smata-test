import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import { updateDocumentStatus } from '../../../../actions/dms';
import { ActionForm } from './ActionForm';
import { flashActions } from '../../../../actions';

import './CancelHoldInvoice.module.scss';

const OffHoldForm = ({
  handleSubmit,
  submitFailed,
  closeModal,
  setKeepDropdownOpen,
  documentName,
  id,
  reloadPage,
  setProcessing
}) => {
  const newState = useSelector((state) => state.form.OffHold);
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
      await dispatch(updateDocumentStatus(documentName, id, 'under_review', note));
      setProcessing(false);
      dispatch(flashActions.showSuccess('The invoice has been taken off hold'));
      reloadPage();
    } catch (error) {
      setProcessing(false);
      dispatch(flashActions.showError(error));
    }
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>Take off hold?</h3>
      <p className='cancel-hold-invoice-text'>
        Are you sure you want to take '{documentName}' off hold?
      </p>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={textField}
        closeModal={closeModal}
        buttonText='Take off hold'
        actionButtonColor='green'
      />
    </div>
  );
};

export const OffHold = reduxForm({
  form: 'OffHold'
})(OffHoldForm);
