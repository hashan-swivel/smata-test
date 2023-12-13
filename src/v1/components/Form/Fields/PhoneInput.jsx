import React from 'react';
import ReactPhoneInput from 'react-phone-number-input';
import './PhoneInput.module.scss';

export const PhoneInput = (props) => {
  const { placeholder, input, disabled } = props;
  return (
    <ReactPhoneInput
      {...input}
      country='AU'
      countries={['AU', 'NZ', 'GB', 'US']}
      placeholder={placeholder}
      disabled={disabled}
      international={false}
    />
  );
};
