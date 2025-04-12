'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { usePageStore, useSearchParamsStore } from '@/store';
import { Table } from '@tanstack/react-table';
import PageSizeSelector from './pageSize-selector';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  limit: number;
  setLimit: (limit: number) => void;
  totalRecords: number | undefined;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function DataTablePagination<TData>({
  table,
  limit,
  setLimit,
  totalRecords,
  totalPages,
  onPageChange,
}: DataTablePaginationProps<TData>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { currentPage, setCurrentPage } = usePageStore();
  const [totalPagesState, setTotalPagesState] = useState(totalPages); // 🆕 State untuk total pages

  // const searchParams = useSearchParamsStore((state) => state.searchParams);

  // Saat komponen pertama kali dimuat, baca page dari URL
  useEffect(() => {
    // Set page index to match the current URL param
    const url = new URL(window.location.href);
    const page = url.searchParams.get('page');

    if (page) {
      const pageIndex = parseInt(page, 10) - 1; // Adjust for zero-based index
      if (pageIndex !== currentPage) {
        setCurrentPage(pageIndex);
      }
    }
  }, [table]);

  useEffect(() => {
    // Update URL and Zustand state when page changes
    const pageIndex = table.getState().pagination.pageIndex + 1;
    setCurrentPage(pageIndex);
    const url = new URL(window.location.href);
    url.searchParams.set('page', pageIndex.toString());
    window.history.pushState({}, '', url.toString());
  }, [table.getState().pagination.pageIndex]);

  // 🆕 Perbaikan: Hitung ulang total halaman setiap kali totalRecords berubah
  useEffect(() => {
    if (totalRecords !== undefined && totalRecords > 0) {
      const calculatedPages = Math.ceil(
        totalRecords / table.getState().pagination.pageSize
      );

      setTotalPagesState(calculatedPages); // 🔥 Update total halaman

      // ✅ Pastikan currentPage tidak lebih besar dari totalPagesState setelah pencarian
      if (currentPage > calculatedPages) {
        setCurrentPage(calculatedPages > 0 ? calculatedPages : 1);
      }
    }
  }, [
    totalRecords,
    table.getState().pagination.pageSize,
    currentPage,
    setCurrentPage,
  ]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPagesState) return; // Pastikan page dalam batas yang valid

    setCurrentPage(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    // Kembalikan posisi scroll agar tidak naik ke atas
    setTimeout(() => {
      window.scrollTo(0, window.scrollY);
    }, 0);

    // ✅ Panggil `onPageChange` jika disediakan
    onPageChange?.(page);
  };

  return (
    <div className='flex items-center flex-wrap gap-2 justify-between p-5'>
      {/* <div className='flex w-[100px] items-center justify-center text-xs'>
        {table.getFilteredSelectedRowModel().rows.length > 0
          ? `${table.getFilteredSelectedRowModel().rows.length} of ${totalRecords} data selected.`
          : `Total ${totalRecords} data`}
      </div> */}
      <div className='flex flex-wrap items-center gap-6 lg:gap-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs'>
          <PageSizeSelector
            limit={limit}
            setLimit={setLimit}
            onPageSizeChange={(value) => table.setPageSize(value)}
          />

          <p className='mt-2 sm:mt-0 whitespace-nowrap text-muted-foreground'>
            Page {currentPage} of {totalPagesState}{' '}
            {totalPagesState === 1 ? 'Page' : 'Pages'}
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>

          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => handlePageChange(table.getPageCount() - 1)}
            disabled={currentPage === totalPages}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
