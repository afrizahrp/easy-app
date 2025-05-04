// constants/searchContexts.ts
export const SEARCH_CONTEXTS = [
  'salesInvoice',
  'salesPersonInvoice',
  'purchasing',
  'inventory',
] as const;

export type SearchContext = (typeof SEARCH_CONTEXTS)[number];
