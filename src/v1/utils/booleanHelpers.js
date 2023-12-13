export const boolToString = (
  val,
  defaultDisplay = null,
  trueDisplay = 'YES',
  falseDisplay = 'NO'
) => {
  if (typeof val === 'boolean' && val) return trueDisplay;
  if (typeof val === 'boolean' && !val) return falseDisplay;

  return defaultDisplay;
};
