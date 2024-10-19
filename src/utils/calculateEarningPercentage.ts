const calculateEarningPercentage = (
  earningsThisMonth: number = 0,
  earningsLastMonth: number = 0
): number => {
  if (earningsLastMonth === 0) {
    return earningsThisMonth > 0 ? 100 : 0;
  }

  const percentageChange =
    ((earningsThisMonth - earningsLastMonth) / earningsLastMonth) * 100;

  return parseFloat(percentageChange.toFixed(2));
};

export default calculateEarningPercentage;
