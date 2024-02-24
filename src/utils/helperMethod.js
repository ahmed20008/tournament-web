export const calculateAverage = (values) => {
  const sum = values.reduce((acc, curr) => acc + parseFloat(curr), 0);
  const average = sum / values.length;
  return isNaN(average) ? 'N/A' : average.toFixed(2);
};
