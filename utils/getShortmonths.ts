export const getShortMonth = (month: string): string => {
  const shortMonths: { [key: string]: string } = {
    January: 'Jan',
    February: 'Feb',
    March: 'Mar',
    April: 'Apr',
    May: 'May',
    June: 'Jun',
    July: 'Jul',
    August: 'Aug',
    September: 'Sep',
    October: 'Oct',
    November: 'Nov',
    December: 'Dec',
  };

  return (
    shortMonths[month] ||
    month.charAt(0).toUpperCase() + month.slice(1, 3).toLowerCase()
  );
};
