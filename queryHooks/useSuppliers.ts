// import { po_supplier } from '@prisma/client';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface po_supplier {
  id: string;
  supplier_cd: string;
  name: string;
  address1: string;
  address2: string;
  address3: string;
  post_cd: string;
  tel_no: string;
  fax_no: string;
  email: string;
  contact_person: string;
  credit_term: number;
  remarks: string;
}

export const useSuppliers = (searchTerms: string, searchType: string) => {
  // const debouncedSearchTerm = searchTerms; //useDebounce(searchTerms, 500); // Debounce the search term by 500ms

  const { data, isLoading, error, ...rest } = useQuery<po_supplier[], Error>({
    queryKey: ['suppliers', searchTerms],
    queryFn: () =>
      searchTerms
        ? axios
            .get('/api/purchasing/suppliers', {
              params: {
                [searchType]: searchTerms, // use searchType as the parameter name
              },
            })
            .then((res) => res.data)
        : Promise.resolve([]), // Resolve to an empty array if name is not provided

    staleTime: 60 * 1000, //60s
    retry: 3,
    enabled: !!searchTerms && !!searchType, // Only run the query if both searchTerms and searchType are provided
  });

  return { data, isLoading, error, ...rest };
};

export default useSuppliers;
