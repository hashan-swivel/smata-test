import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxForm, autofill, reset } from 'redux-form';
import { postAlert } from '../../../actions/alerts';
import { Fields } from '../Form';
import { isValidEmail } from '../Form/validationHelper';
import './ReduxFormExample.module.scss';

// Set form name
const formName = 'profileForm';

// Fields array
const fields = [
  {
    name: 'basicDetails',
    label: 'Basic Details',
    component: 'heading'
  },
  {
    name: 'firstName',
    label: 'First Name',
    component: 'input',
    type: 'text',
    leftCol: true
  },
  {
    name: 'lastName',
    label: 'Last Name',
    component: 'input',
    type: 'text',
    rightCol: true
  },
  {
    name: 'role',
    label: 'User Role',
    component: 'radio',
    options: [
      {
        value: 'admin',
        label: 'Admin'
      },
      {
        value: 'staff',
        label: 'Staff'
      }
    ]
  },
  {
    name: 'office',
    label: 'Office',
    component: 'select',
    placeholder: 'Please select',
    options: [
      {
        value: '3A',
        label: '3A'
      },
      {
        value: '3B',
        label: '3B'
      },
      {
        value: '3C',
        label: '3C'
      }
    ]
  },
  {
    name: 'email',
    label: 'Email Address',
    component: 'input',
    type: 'email'
  },
  {
    name: 'bio',
    label: 'Bio',
    component: 'textarea'
  }
];

const Form = ({ submitFailed, handleSubmit, formData = {} }) => {
  // Component state items
  const [submitting, setSubmitting] = useState(false);
  // Redux form state
  const formState = useSelector((state) => state.form[formName]);
  const { values, syncErrors } = formState;
  // Get access to dispatch
  const dispatch = useDispatch();

  // Submit function
  const onSubmit = (props) => {
    setSubmitting(true);
    setTimeout(() => {
      dispatch(reset(formName));
      dispatch(postAlert('Thanks for getting in touch', 'success'));
      setSubmitting(false);
    }, 1000);
  };

  // When component mounts
  useEffect(() => {
    // Check for prepopulated data
    const prepopulatedData = Object.entries(formData);
    // Autofill each field with prepopulated data
    prepopulatedData.forEach((data) => {
      const [field, value] = data;
      dispatch(autofill(formName, field, value));
    });
    // Reset form state on clean up
    return () => dispatch(reset(formName));
  }, []);

  // Render form UI
  return (
    <section className='redux-form-example'>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <Fields
          fields={fields}
          submitFailed={submitFailed}
          values={values}
          syncErrors={syncErrors}
        />
        <button
          type='submit'
          disabled={submitting}
          className={submitting ? 'button submitting' : 'button'}
        >
          {submitting ? 'Submitting' : 'Update Profile'}
        </button>
      </form>
    </section>
  );
};

// Validate form content
const validate = (values) => {
  const errors = {};
  if (!values.firstName) errors.firstName = 'Please enter your first name';
  else if (!values.lastName) errors.lastName = 'Please enter your last name';
  else if (!values.email) errors.email = 'Please enter your email address';
  else if (!isValidEmail(values.email)) errors.email = 'Please enter a valid email address';
  return errors;
};

// Wrap component in reduxForm HOC
export const ReduxFormExample = reduxForm({
  form: formName,
  destroyOnUnmount: false,
  enableReinitialize: false,
  initialValues: {
    role: 'admin'
  },
  validate
})(Form);
