import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchParamsStore, usePageStore } from '@/store';
import { Icon } from '@iconify/react';
import { useDebounce } from 'use-debounce';

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className }: SearchInputProps) {
  const { setSearchParam, removeSearchParam } = useSearchParamsStore();
  const { setCurrentPage } = usePageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) {
      params.set('name', debouncedSearchTerm);
      params.set('page', '1');
      setSearchParam('name', debouncedSearchTerm);
    } else {
      params.delete('name');
      params.delete('page');
      removeSearchParam('name');
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
        placeholder='Type here to search...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='border rounded-md px-10 py-2 w-full sm:max-w-[300px] lg:max-w-[700px] sm:py-2 lg:py-3'
      />

      <Icon
        icon='heroicons:magnifying-glass'
        className='w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-500'
      />

      {searchTerm && (
        <Icon
          icon='heroicons:x-mark'
          className='w-4 h-4 absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer'
          onClick={() => {
            setSearchTerm('');
            removeSearchParam('name');
          }}
        />
      )}
    </div>
  );
}
