import React from 'react';
import { Form, reduxForm } from 'redux-form';
import { useSelector } from 'react-redux';
import { Fields } from '../Form';
import { PhoneInput } from '../Form/Fields';
import { validate } from './validate';

const fields = [
  {
    name: 'agentName',
    label: 'Agency Name',
    component: 'input',
    type: 'text'
  },
  {
    name: 'agentAddress',
    label: 'Agency Address',
    component: 'input',
    type: 'text'
  },
  {
    name: 'agentEmail',
    label: 'Agency Email',
    component: 'input',
    type: 'email'
  },
  {
    name: 'agentNumber',
    label: 'Agency Phone Number',
    component: PhoneInput,
    type: 'number'
  }
];

const AgentDetails = (props) => {
  const formName = 'committeeForm';
  const { onSubmit, previousPage, handleSubmit, submitFailed } = props;
  const formState = useSelector((state) => state.form[formName]);
  const { values, syncErrors } = formState;
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='auth-form-background agent-form'>
      <div className='auth-form__logo-container'>
        <div className='auth-form__logo' />
      </div>
      <p className='auth-form-title'>Confirm real estate agent details</p>
      <Fields
        fields={fields}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        formName={formName}
      />
      <span className='button-grid'>
        <button type='button' className='button secondary left-button' onClick={previousPage}>
          Back
        </button>
        <button type='submit' className='button primary right-button'>
          Next
        </button>
      </span>
    </Form>
  );
};

export default reduxForm({
  form: 'committeeForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(AgentDetails);
