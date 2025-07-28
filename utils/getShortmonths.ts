export const getShortMonth = (month: string): string => {
  return month.charAt(0).toUpperCase() + month.slice(1, 3).toLowerCase();
};
