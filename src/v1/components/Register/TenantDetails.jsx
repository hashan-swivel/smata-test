import React from 'react';
import { Form, reduxForm } from 'redux-form';
import { useSelector } from 'react-redux';
import { Fields } from '../Form';
import { validate } from './validate';
import { PhoneInput, DatePicker } from '../Form/Fields';

const fields = (values) => [
  {
    name: 'tenantName',
    label: 'Tenant Name',
    component: 'input',
    type: 'text',
    disabled: values.unoccupied
  },
  {
    name: 'tenantEmail',
    label: 'Tenant Email',
    component: 'input',
    type: 'email',
    disabled: values.unoccupied
  },
  {
    name: 'tenantNumber',
    label: 'Tenant Phone Number',
    component: PhoneInput,
    type: 'phone',
    disabled: values.unoccupied
  },
  {
    name: 'leaseStart',
    label: 'Lease start date',
    component: DatePicker,
    leftCol: true,
    disabled: values.unoccupied
  },
  {
    name: 'leaseEnd',
    label: 'Lease end date',
    component: DatePicker,
    rightCol: true,
    disabled: values.unoccupied
  },
  {
    name: 'unoccupied',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'yes',
        label: 'Property is currently unoccupied'
      }
    ]
  }
];

const TenantDetails = (props) => {
  const formName = 'committeeForm';
  const { onSubmit, handleSubmit, submitFailed } = props;
  const formState = useSelector((state) => state.form[formName]);
  const { values, syncErrors } = formState;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='auth-form-background tenant-form'>
      <div className='auth-form__logo-container'>
        <div className='auth-form__logo' />
      </div>
      <p className='auth-form-title'>Confirm tenant details</p>
      <Fields
        fields={fields(values)}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        formName={formName}
      />
      <span className='button-grid'>
        <button type='submit' className='button secondary left-button'>
          Back
        </button>
        <button type='submit' className='button primary right-button'>
          Enter
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
})(TenantDetails);
