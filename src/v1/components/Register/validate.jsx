import { isValidEmail, isValidNumber } from '../Form/validationHelper';

export const validate = (values) => {
  const errors = {};

  if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[a-zA-Z\d\w\W]{8,128}$/g.test(values.password))
    errors.password =
      'Must contain 8 or more character. Must contain uppercase letters, lowercase letters and numbers';
  else if (!values.passwordConfirm || values.passwordConfirm !== values.password)
    errors.passwordConfirm = 'Passwords do not match';
  else if (!values.terms || values.terms === false)
    errors.terms = 'You must agree to the terms of service and privacy policy';
  else if (!values.contactName) errors.contactName = 'Please enter a contact name';
  else if (!values.mobileNumber) errors.mobileNumber = 'Please enter a mobile number';
  else if (!isValidNumber(values.mobileNumber))
    errors.mobileNumber = 'Please enter a valid mobile number';
  else if (!values.emailAddress) errors.emailAddress = 'Please enter your email address';
  else if (!isValidEmail(values.emailAddress))
    errors.emailAddress = 'Please enter a valid email address';
  else if (!values.userDescription) errors.userDescription = 'Please select an option';
  else if (!isValidNumber(values.agentNumber))
    errors.agentNumber = 'Please enter a valid phone number';

  return errors;
};
