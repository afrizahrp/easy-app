'use client';
import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { usePageStore } from '@/store';

interface DataTablePaginationProps {
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  totalPages,
  onPageChange,
}) => {
  const { currentPage, setCurrentPage } = usePageStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Saat komponen pertama kali dimuat, baca page dari URL
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl) {
      setCurrentPage(Number(pageFromUrl));
    }
  }, [searchParams, setCurrentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    // router.replace(`${pathname}?${params.toString()}`);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    // Kembalikan posisi scroll agar tidak scroll-up
    setTimeout(() => {
      window.scrollTo(0, window.scrollY);
    }, 0);

    // ✅ Panggil `onPageChange` dari `DataTable`
    onPageChange?.(page);
  };

  // Fungsi untuk mengubah halaman dan memperbarui URL
  // const onPageChange = (page: number) => {
  //   if (page < 1 || page > totalPages) return;

  //   setCurrentPage(page);

  //   // Simpan posisi scroll sebelum navigasi
  //   const scrollY = window.scrollY;

  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set('page', page.toString());

  //   router.replace(`${pathname}?${params.toString()}`);

  //   // Tunggu update URL sebelum mengembalikan posisi scroll
  //   setTimeout(() => {
  //     window.scrollTo(0, scrollY);
  //   }, 0);
  // };

  return (
    <div className='flex items-center flex-wrap gap-2 justify-between p-5'>
      <div className='flex w-[100px] items-center justify-center text-xs'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex flex-wrap items-center gap-6 lg:gap-8'>
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
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};
