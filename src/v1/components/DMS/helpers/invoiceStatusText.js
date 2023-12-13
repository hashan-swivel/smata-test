const invoiceStatusText = (status, isExported, extractionStatus) => {
  if (status) return status.split('_').join(' ');
};

export default invoiceStatusText;
