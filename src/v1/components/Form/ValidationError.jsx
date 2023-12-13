import React from 'react';
import { useSelector } from 'react-redux';
import './ValidationError.module.scss';
import { PasswordIndicator } from '../Register/PasswordIndicator';

export const ValidationError = (props) => {
  const { submitFailed, errors, field, formName } = props;
  const formState = useSelector((state) => state.form[formName]);
  const isActive = submitFailed && errors && errors[field];

  if (field === 'password' && formState && formState.active === 'password') {
    return <PasswordIndicator passwordError={errors.password} />;
  }
  return (
    <span className={`validation-error ${isActive ? 'active' : 'inactive'}`}>
      {errors ? errors[field] : ''}
    </span>
  );
};
