export const validate = (values) => {
  const errors = {};
  if (!values.building) errors.building = 'Select a building';
  if (!values.contacts || values.contacts.length < 1) {
    if (
      !values.everyone &&
      !values.committeeMembers &&
      !values.owners &&
      !values.tenants &&
      !values.agents
    )
      errors.contacts = 'Please select a contact';
  }
  if (!values.initialMessage || values.initialMessage.length < 1) {
    errors.initialMessage = 'Please add initial message';
  }
  return errors;
};
