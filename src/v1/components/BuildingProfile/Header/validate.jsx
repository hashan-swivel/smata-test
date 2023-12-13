export const validate = (values) => {
  const errors = {};
  if (values.oneOffIntRequired) {
    if (!values.oneOffIntAmount) errors.oneOffIntAmount = 'Please enter an amount';
    if (!values.oneOffIntApproval) errors.oneOffIntApproval = 'Please select a contact';
  }
  if (values.oneOffExtRequired) {
    if (!values.oneOffExtAmount) errors.oneOffExtAmount = 'Please enter an amount';
    if (!values.amountToApprove) errors.amountToApprove = 'Please enter an amount';
    if (!values.oneOffExtApproval) errors.oneOffExtApproval = 'Please select a contact';
  }
  if (values.recurringIntRequired) {
    if (!values.recurringIntAmount) errors.recurringIntAmount = 'Please enter an amount';
    if (!values.recurringIntApproval) errors.recurringIntApproval = 'Please select a contact';
  }
  if (values.recurringExtRequired) {
    if (!values.recurringExtAmount) errors.recurringExtAmount = 'Please enter an amount';
    if (!values.recurringExtApproval) errors.recurringExtApproval = 'Please select a contact';
  }
  return errors;
};
