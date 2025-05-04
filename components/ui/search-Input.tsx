// src/components/SearchInput.tsx
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchParamsStore, usePageStore } from '@/store';
import { Icon } from '@iconify/react';
import { useDebounce } from 'use-debounce';

interface SearchInputProps {
  className?: string;
  searchBy?: string;
  placeholder?: string;
  context: 'salesInvoice' | 'salesPersonInvoice'; // Tambahkan konteks
}

export default function SearchInput({
  className,
  placeholder,
  context,
}: SearchInputProps) {
  const { searchParams, setSearchParam, removeSearchParam } =
    useSearchParamsStore();
  const { setCurrentPage } = usePageStore();

  const initialSearchTerm = searchParams?.[context]?.searchTerm || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    console.log(`SearchInput [${context}] debounced: ${debouncedSearchTerm}`);
    if (debouncedSearchTerm) {
      setSearchParam(context, 'searchTerm', debouncedSearchTerm);
      console.log(`Set searchTerm for ${context}: ${debouncedSearchTerm}`);
    } else {
      removeSearchParam(context, 'searchTerm');
      console.log(`Removed searchTerm for ${context}`);
    }
    setCurrentPage(1);
  }, [
    debouncedSearchTerm,
    context,
    setSearchParam,
    removeSearchParam,
    setCurrentPage,
  ]);

  return (
    <div className={`relative flex-grow min-w-0 ${className}`}>
      <Input
        type='text'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='pl-10 pr-10 py-2 w-full border rounded-md'
      />
      <Icon
        icon='heroicons:magnifying-glass'
        className='w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-500'
      />
      {searchTerm && (
        <Icon
          icon='heroicons:x-mark'
          className='w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer'
          onClick={() => {
            setSearchTerm('');
            removeSearchParam(context, 'searchTerm');
          }}
        />
      )}
    </div>
  );
}
