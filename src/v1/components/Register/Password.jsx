import React from 'react';
import { Form, reduxForm } from 'redux-form';
import { useSelector } from 'react-redux';
import { Fields } from '../Form';
import { validate } from './validate';
import { Logo } from '../Logo';
import { baseBackEndUrlWithSubdomain } from '../../../utils';

import './Password.module.scss';

const fields = [
  {
    name: 'password',
    label: 'Password',
    component: 'input',
    type: 'password',
    disabledAutoComplete: true
  },
  {
    name: 'passwordConfirm',
    label: 'Confirm Password',
    component: 'input',
    type: 'password',
    disabledAutoComplete: true
  },
  {
    name: 'terms',
    component: 'checkbox',
    noLabel: true,
    options: [
      {
        value: 'yes',
        label: `I agree to the <a href="${baseBackEndUrlWithSubdomain()}/terms_and_conditions" target="_blank">terms of service</a>`
      }
    ],
    classNames: 'agreement-checkbox'
  }
];

const formName = 'committeeForm';

const Password = ({ onSubmit, handleSubmit, submitFailed, isSubmitting, logo }) => {
  const formState = useSelector((state) => state.form[formName]);
  const { values, syncErrors } = formState;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='auth-form-background password-form'>
      <div className='auth-form__logo-container'>
        <Logo light user image={logo || ''} />
      </div>
      <div className='auth-form__title'>
        <h5>Create your password</h5>
      </div>
      <Fields
        fields={fields}
        submitFailed={submitFailed}
        values={values}
        syncErrors={syncErrors}
        formName={formName}
      />
      <button type='submit' className='next-button button primary' disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Next'}
      </button>
    </Form>
  );
};

export default reduxForm({
  form: 'committeeForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  touchOnChange: true,
  initialValues: {
    terms: false
  },
  validate
})(Password);
