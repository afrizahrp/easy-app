import { getFallbackColor, salesPersonColorMap } from './salesPersonColorMap';

export const getSalesPersonColor = (name: string) => {
  const key = name;
  return salesPersonColorMap[key] || getFallbackColor(name);
};
