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

export const calculateMarks = (average) => {
  if (average <= 15) {
    return 0;
  } else if (average > 15 && average <= 30) {
    return 50;
  } else if (average > 30 && average <= 45) {
    return 60;
  } else if (average > 45 && average <= 50) {
    return 70;
  } else if (average > 50) {
    return 100;
  } else {
    return 100;
  }
};