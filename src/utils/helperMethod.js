export const calculateAverage = (values) => {
  const sum = values.reduce((acc, curr) => acc + parseFloat(curr), 0);
  const average = sum / values.length;
  return isNaN(average) ? 'N/A' : average.toFixed(2);
};

export const getHighestScore = (scores) => {
  if (!scores || scores.length === 0) {
    return '';
  }
  const highestScore = scores.sort((a, b) => b.score - a.score)[0];
  return highestScore.score;
};