import React from 'react';
import { Form } from 'redux-form';
import { Fields } from '../../Form';
import './ActionForm.module.scss';

export const ActionForm = ({
  handleSubmit,
  submitFailed,
  values,
  syncErrors,
  onSubmit,
  field,
  closeModal,
  buttonText,
  actionButtonColor
}) => {
  return (
    <Form className='action-form' onSubmit={handleSubmit(onSubmit)}>
      <Fields fields={field} submitFailed={submitFailed} values={values} syncErrors={syncErrors} />
      <div className='buttons-container'>
        <button type='button' className='button close-button' onClick={closeModal}>
          Close
        </button>
        <button type='submit' className={`button success-button ${actionButtonColor}`}>
          {buttonText}
        </button>
      </div>
    </Form>
  );
};
