// utils/makeInitialSearchParams.ts
import { SEARCH_CONTEXTS, SearchContext } from '@/constants/searchContexts';

export const makeInitialSearchParams = (): Record<
  SearchContext,
  { searchBy: string; searchTerm: string }
> => {
  const initial = Object.fromEntries(
    SEARCH_CONTEXTS.map((ctx) => [
      ctx,
      { searchBy: 'invoice_id', searchTerm: '' },
    ])
  ) as Record<SearchContext, { searchBy: string; searchTerm: string }>;
  // console.log('Initial Search Params:', initial);
  return initial;
};
