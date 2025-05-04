// constants/searchContexts.ts
export const SEARCH_CONTEXTS = ['salesInvoice', 'salesPersonInvoice'] as const;

export type SearchContext = (typeof SEARCH_CONTEXTS)[number];
