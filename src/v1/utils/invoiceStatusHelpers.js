export const convertToInvoiceStateable = (status) => {
  if (status) return status.toLowerCase().replaceAll(' ', '_');
};
