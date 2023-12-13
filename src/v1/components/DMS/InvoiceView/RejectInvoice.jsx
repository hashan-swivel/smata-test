import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm } from 'redux-form';
import { ActionForm } from './ActionForm';
import { axiosInstance } from '../../../../utils';
import { flashActions } from '../../../../actions';

const RejectInvoiceForm = ({
  handleSubmit,
  submitFailed,
  closeModal,
  setKeepDropdownOpen,
  id,
  jobTradeContractorId,
  reloadInvoice,
  contractor
}) => {
  const newNoticeState = useSelector((state) => state.form.RejectInvoice);
  const [notifyContractor, setNotifyContractor] = useState(false);
  const dispatch = useDispatch();

  const { values, syncErrors } = newNoticeState || {};

  const textField = [
    {
      name: 'note',
      component: 'input',
      type: 'textarea',
      label:
        'Add a note for this action which will be displayed in the Document History for future reference & shared with the contractor if selected',
      placeholder: 'Write your message...'
    }
  ];

  const onSubmit = async () => {
    setKeepDropdownOpen(false);
    closeModal();
    const note = values && values.note ? values.note : '';

    const url = jobTradeContractorId
      ? `v1/job_trade_contractors/${jobTradeContractorId}/update_state`
      : `v1/documents/${id}/invoice/update_status`;
    const data = jobTradeContractorId
      ? { status_note: note, notify_contractor: notifyContractor, commit: 'reject_invoice' }
      : { status_note: note, notify_contractor: notifyContractor, commit: 'reject' };

    axiosInstance
      .patch(url, data)
      .then(() => {
        dispatch(flashActions.showSuccess('Invoice has been rejected'));
        reloadInvoice(false);
      })
      .catch((error) => {
        dispatch(flashActions.showError(error));
        reloadInvoice(false);
      });
  };

  return (
    <div className='reject-invoice-container'>
      <h3 className='reject-invoice-title' style={{ marginBottom: '15px' }}>
        Are you sure you wish to reject this invoice?
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
              Send a notification to the Service provider with the reason for your rejection
            </label>
          </div>
        </div>
      )}
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={textField}
        closeModal={closeModal}
        buttonText='Reject Invoice'
        actionButtonColor='red'
      />
    </div>
  );
};

export const RejectInvoice = reduxForm({
  form: 'RejectInvoice'
})(RejectInvoiceForm);
