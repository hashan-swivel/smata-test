export const gstCalculator = (amount, gstRegistered, country = 'AU') => {
  if (!gstRegistered) return 0;
  if (parseFloat(amount) === 0) return 0;
  if (Number.isNaN(Number(amount)) || (typeof amount === 'string' && amount.length === 0)) return 0;

  const gstRate = country === 'NZ' ? 15 : 10; // Default is 10%
  return (parseFloat(amount) - (parseFloat(amount) * 100) / (100 + gstRate)).toFixed(2);
};
