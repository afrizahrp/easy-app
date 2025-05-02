import { getFallbackColor, salesPersonColorMap } from './salesPersonColorMap';

export const getSalesPersonColor = (name: string) => {
  const key = name.toLowerCase();
  return salesPersonColorMap[key] || getFallbackColor(name);
};
