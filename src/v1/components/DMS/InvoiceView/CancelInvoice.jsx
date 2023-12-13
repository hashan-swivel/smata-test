import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import { axiosInstance } from '../../../../utils';
import { ActionForm } from './ActionForm';
import { flashActions } from '../../../../actions';

import './CancelHoldInvoice.module.scss';

const CancelInvoiceForm = ({
  handleSubmit,
  submitFailed,
  closeModal,
  setKeepDropdownOpen,
  id,
  reloadInvoice,
  contractor
}) => {
  const newFormState = useSelector((state) => state.form.CancelInvoice);
  const [notifyContractor, setNotifyContractor] = useState(false);
  const dispatch = useDispatch();

  const { values, syncErrors } = newFormState || {};

  const fields = [
    {
      name: 'note',
      component: 'input',
      type: 'textarea',
      label:
        'Add a note for this action which will be displayed in the Document History for future reference & shared with the contractor if selected:',
      placeholder: 'Write your note...'
    }
  ];

  const onSubmit = async () => {
    setKeepDropdownOpen(false);
    closeModal();
    const note = values && values.note ? values.note : '';

    axiosInstance
      .patch(`v1/documents/${id}/invoice/cancel`, {
        status_note: note,
        notify_contractor: notifyContractor
      })
      .then(() => {
        dispatch(flashActions.showSuccess('Invoice has been canceled'));
        reloadInvoice(false);
      })
      .catch((error) => {
        dispatch(flashActions.showError(error));
        reloadInvoice(false);
      });
  };

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='reject-invoice-title' style={{ marginBottom: '15px' }}>
        Are you sure you wish to cancel this invoice?
      </h3>
      {contractor?.id && (
        <div className='checkboxes-field' style={{ marginBottom: '15px' }}>
          <div className='option'>
            <input
              id={`selected-file-${id}`}
              name={`selected-file-${id}`}
              onChange={() => setNotifyContractor(!notifyContractor)}
              type='checkbox'
            />
            <label htmlFor={`selected-file-${id}`}>
              Send a notification to the Service provider with the reason for your cancellation
            </label>
          </div>
        </div>
      )}
      {!contractor?.payments_email && notifyContractor && (
        <p className='cancel-notification-danger'>
          There is no email available for this Service Provider
        </p>
      )}
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={fields}
        closeModal={closeModal}
        buttonText='Cancel Invoice'
        actionButtonColor='red'
      />
    </div>
  );
};

export const CancelInvoice = reduxForm({
  form: 'CancelInvoice'
})(CancelInvoiceForm);
