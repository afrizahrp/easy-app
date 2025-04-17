import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchParamsStore, usePageStore } from '@/store';
import { Icon } from '@iconify/react';
import { useDebounce } from 'use-debounce';

interface SearchInputProps {
  className?: string;
  searchBy?: string;
  placeholder?: string;
}

export default function SearchInput({
  className,
  searchBy,
  placeholder,
}: SearchInputProps) {
  const { setSearchParam, removeSearchParam } = useSearchParamsStore();
  const { setCurrentPage } = usePageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) {
      params.set('page', '1');
      setSearchParam('searchTerm', debouncedSearchTerm); // Ubah ke searchTerm
    } else {
      params.delete('searchTerm');
      params.delete('page');
      removeSearchParam('searchTerm');
    }
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [debouncedSearchTerm, setSearchParam, removeSearchParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, setCurrentPage]);

  return (
    <div className={`relative flex-grow min-w-0 ${className}`}>
      <Input
        type='text'
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // className='border rounded-md px-10 py-2 w-full sm:max-w-[300px] lg:max-w-[500px] sm:py-2 lg:py-3'
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
            removeSearchParam('searchTerm');
          }}
        />
      )}
    </div>
  );
}
