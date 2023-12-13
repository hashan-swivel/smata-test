import React, { useEffect } from 'react';
import { Form, reduxForm, reset } from 'redux-form';
import { useSelector, useDispatch } from 'react-redux';
import { Fields } from '../Form';
import { updateUserPassword } from '../../../actions/auth';
import { flashActions } from '../../../actions';
import { userConstants } from '../../../constants';

import './ProfileSettings.module.scss';

const fields = [
  {
    name: 'current_password',
    label: 'Current password',
    component: 'input',
    type: 'password',
    required: true
  },
  {
    name: 'password',
    label: 'New password',
    hint: `(${userConstants.PASSWORD_MIN_LENGTH} or more characters. Must contain uppercase letters, lowercase letters and numbers)`,
    placeholder: 'New password',
    component: 'input',
    type: 'password',
    required: true
  },
  {
    name: 'password_confirmation',
    label: 'Confirm new password',
    component: 'input',
    type: 'password',
    required: true
  }
];

export const UpdatePasswordForm = (props) => {
  const { user, handleSubmit } = props;

  const formState = useSelector((state) => state.form.updatePassword);
  const { values, syncErrors } = formState || {};

  const dispatch = useDispatch();

  const onSubmit = async () => {
    if (values.password !== values.password_confirmation) {
      return dispatch(flashActions.showError('The new password doesnt match confirm new password'));
    }

    dispatch(updateUserPassword({ ...values, id: user.id }));
    dispatch(reset('updatePassword'));
  };

  return (
    <div className='profile-settings-container'>
      <div className='user-password'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Fields fields={fields} values={values} syncErrors={syncErrors} />
          <button type='submit' className='button primary update-profile-button'>
            Save
          </button>
        </Form>
      </div>
    </div>
  );
};

export const UpdatePassword = reduxForm({
  form: 'updatePassword'
})(UpdatePasswordForm);
