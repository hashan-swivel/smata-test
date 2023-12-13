import { isValidPhoneNumber } from 'react-phone-number-input';

export const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const isValidMobile = (mobile) => {
  const re = /^04[0-9]{8}$/g;
  return re.test(mobile);
};

export const isValidNumber = (number) => isValidPhoneNumber(number);
