'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface PageSizeSelectorProps {
  limit: number;
  setLimit: (limit: number) => void;
  onPageSizeChange?: (value: number) => void;
}

export default function PageSizeSelector({
  limit,
  setLimit,
  onPageSizeChange,
}: PageSizeSelectorProps) {
  const handleChange = (value: string) => {
    const pageSize = Number(value);
    setLimit(pageSize);
    onPageSizeChange?.(pageSize);
  };

  return (
    <div className='flex items-center space-x-2'>
      <p className='text-xs text-muted-foreground whitespace-nowrap hidden sm:block'>
        Show
      </p>
      <Select value={`${limit}`} onValueChange={handleChange}>
        <SelectTrigger className='h-6 w-[70px] text-xs'>
          <SelectValue placeholder={limit} />
        </SelectTrigger>
        <SelectContent side='bottom'>
          {[5, 10, 20].map((pageSize) => (
            <SelectItem
              key={pageSize}
              value={`${pageSize}`}
              className='text-xs'
            >
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* <p className='text-xs text-muted-foreground whitespace-nowrap hidden sm:block'>
        Rows perpage
      </p> */}
    </div>
  );
}
