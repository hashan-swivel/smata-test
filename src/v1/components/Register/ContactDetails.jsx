import React, { useEffect } from 'react';
import { Form, reduxForm, autofill } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';
import { Fields } from '../Form';
import { PhoneInput } from '../Form/Fields';
import { validate } from './validate';
import { Logo } from '../Logo';

import './ContactDetails.module.scss';

const fields = [
  {
    name: 'firstName',
    label: 'First Name',
    component: 'input',
    type: 'text'
  },
  {
    name: 'lastName',
    label: 'Last Name',
    component: 'input',
    type: 'text'
  },
  {
    name: 'mobileNumber',
    label: 'Mobile Number',
    type: 'phone',
    component: PhoneInput
  },
  {
    name: 'emailAddress',
    label: 'Email Address',
    component: 'input',
    type: 'email'
  }
];

const formName = 'committeeDetailsForm';

const ContactDetails = (props) => {
  const formState = useSelector((state) => state.form[formName]);
  const { user, onSubmit, previousPage, handleSubmit, submitFailed, isSubmitting, logo } = props;
  const { values, syncErrors } = formState;
  const { email, first_name: firstName, last_name: lastName, phone_number: mobileNumber } = user;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(autofill(formName, 'firstName', `${firstName}`));
    dispatch(autofill(formName, 'lastName', `${lastName}`));
    dispatch(autofill(formName, 'mobileNumber', mobileNumber));
    dispatch(autofill(formName, 'emailAddress', email));
  }, [email, firstName, lastName, mobileNumber]);
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className='auth-form-background contact-form'>
        <div className='auth-form__logo-container'>
          <Logo light user image={logo || ''} />
        </div>
        <div className='auth-form__title'>
          <h5>
            All information entered during these steps can be changed later within your account.
          </h5>
        </div>
        <div className='mandatory-fields'>
          <Fields
            fields={fields}
            submitFailed={submitFailed}
            values={values}
            syncErrors={syncErrors}
            formName={formName}
          />
        </div>
        <div className='button-grid'>
          <button
            type='button'
            className='button secondary left-button'
            onClick={previousPage}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button type='submit' disabled={isSubmitting} className='button primary right-button'>
            {isSubmitting ? 'Saving…' : 'Complete'}
          </button>
        </div>
      </Form>
    </>
  );
};

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(ContactDetails);
