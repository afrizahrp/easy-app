import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchParamsStore, usePageStore } from '@/store';
import { Icon } from '@iconify/react';
import { useDebounce } from 'use-debounce';

const SearchInput: React.FC = () => {
  const { setSearchParam, removeSearchParam } = useSearchParamsStore();
  const { currentPage, setCurrentPage } = usePageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // ⏳ Debounce 1/2 detik

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearchTerm) {
      params.set('name', debouncedSearchTerm);
      params.set('page', '1'); // ✅ Reset ke halaman pertama
      setSearchParam('name', debouncedSearchTerm);
    } else {
      params.delete('name');
      params.delete('page'); // ✅ Hapus page jika pencarian dihapus
      removeSearchParam('name');
    }
    window.history.replaceState(null, '', `?${params.toString()}`);
  }, [debouncedSearchTerm, setSearchParam, removeSearchParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, setCurrentPage]);

  return (
    // <div className='relative w-full sm:w-auto'>
    // <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[600px] pl-7 rounded'>
    <div className='relative w-full sm:w-[400px] md:w-[500px] lg:w-[600px]'>
      <Input
        type='text'
        placeholder='Type here to search...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // className='min-w-[300px] sm:max-w-[600px] pl-7 rounded'
        className='w-full min-w-[300px] max-w-[600px] pl-10 pr-10 rounded'
      />
      {searchTerm && (
        <Icon
          icon='heroicons:x-mark'
          className='w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-default-500 cursor-pointer'
          onClick={() => {
            setSearchTerm('');
            removeSearchParam('name');
          }}
        />
      )}
      <Icon
        icon='heroicons:magnifying-glass'
        className='w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 text-default-500'
      />
    </div>
  );
};

export default SearchInput;
