import React, { useEffect } from 'react';
import Router from 'next/router';
import { Form, reduxForm } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { Fields } from '../Form';
import { requestLogin, clearLoginLocation } from '../../../actions/auth';
import { Logo } from '../Logo';
import { flashActions } from '../../../actions';

const LoginForm = (props) => {
  const fields = [
    {
      name: 'email',
      label: 'Email Address',
      component: 'input',
      type: 'email'
    },
    {
      name: 'password',
      label: 'Password',
      component: 'input',
      type: 'password'
    }
  ];

  const dispatch = useDispatch();
  const { handleSubmit, submitFailed } = props;
  const { syncErrors, values } = useSelector((state) => state.form.loginForm) || {};
  const authState = useSelector((state) => state.auth) || {};

  useEffect(() => {
    if (authState && authState.currentUser && authState.currentUser.role) {
      dispatch(flashActions.showSuccess('Signed in successfully'));
      redirectAfterLogin(authState.currentUser, authState.loginLocation);
    }
  }, [authState]);

  const redirectAfterLogin = (user, location) => {
    if (location) {
      dispatch(clearLoginLocation());
      return Router.push(location);
    }
    if (user.isSystemManager) {
      window.location.href = `${user?.baseUrl}/backend/jobs`;
      return true;
    }
    if (user.isStrataMember && user.default_building_profile_id) {
      return Router.push({
        pathname: '/building-profile',
        query: { id: user.default_building_profile_id }
      });
    }

    Router.push('/documents');
  };

  const onSubmit = () =>
    dispatch(requestLogin(values.email, values.password, window.location.href));

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} className='auth-form-background login-form'>
        {authState?.currentUser?.theme?.logo && (
          <div className='auth-form__logo-container'>
            <Logo light user image={authState?.currentUser?.theme?.logo} />
          </div>
        )}
        <div className='auth-form__title'>
          <h5>Enter email and password</h5>
        </div>
        <Fields fields={fields} submitFailed={submitFailed} syncErrors={syncErrors} />
        <button type='submit' className='next-button login-button button primary'>
          Enter
        </button>
      </Form>
    </div>
  );
};

export default reduxForm({
  form: 'loginForm'
})(LoginForm);
