import React from 'react';
import { useSelector } from 'react-redux';
import { reduxForm } from 'redux-form';
import { ActionForm } from './ActionForm';

import './CancelHoldInvoice.module.scss';

const InvoicePriorityForm = ({
  submitFailed,
  handleSubmit,
  closeModal,
  documentName,
  invoicePriority,
  onToggleInvoicePriority,
  id
}) => {
  const formState = useSelector((state) => state.form.invoicePriority);
  const { values, syncErrors } = formState;

  const fields = [
    {
      name: 'reason',
      component: 'input',
      type: 'textarea',
      label:
        'Add a note for this action which will be displayed in the Document History for future reference:',
      placeholder: 'Write your note...'
    }
  ];

  const onSubmit = () => onToggleInvoicePriority(id, !invoicePriority, values?.reason);

  return (
    <div className='cancel-hold-invoice-container'>
      <h3 className='cancel-hold-invoice-title'>
        {invoicePriority ? 'Remove' : 'Add'} invoice priority?
      </h3>
      <p className='cancel-hold-invoice-text'>
        Are you sure you want to {invoicePriority ? 'remove' : 'add'} priority for {documentName}?
      </p>
      <ActionForm
        handleSubmit={handleSubmit}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        onSubmit={onSubmit}
        field={fields}
        closeModal={closeModal}
        buttonText={invoicePriority ? 'Remove' : 'Add'}
        actionButtonColor={invoicePriority ? 'red' : 'green'}
      />
    </div>
  );
};

export const InvoicePriority = reduxForm({
  form: 'invoicePriority',
  destroyOnUnmount: true,
  initialValues: {}
})(InvoicePriorityForm);
