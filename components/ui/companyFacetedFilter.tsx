import * as React from 'react';
import { useCompanyFilterStore } from '@/store';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export default function CompanyFacetedFilter() {
  const companies = useCompanyFilterStore((s) => s.companies);
  const selected = useCompanyFilterStore((s) => s.selectedCompanyIds);
  const setSelected = useCompanyFilterStore((s) => s.setSelectedCompanyIds);

  const [open, setOpen] = React.useState(false);

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((c) => c !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const reset = () => setSelected([]);

  return (
    <div className='mb-4'>
      <div className='mb-1 ml-1 text-sm font-medium text-muted-foreground'>
        Company
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='w-full justify-between'
            size='sm'
          >
            {selected.length > 0
              ? `${selected.length} selected`
              : 'Filter by Company'}
            <ChevronsUpDown className='ml-2 h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-64 p-0' align='start'>
          <Command>
            <CommandInput placeholder='Cari perusahaan...' />
            <CommandEmpty>Tidak ditemukan</CommandEmpty>
            <CommandList>
              {companies.map((company) => (
                <CommandItem
                  key={company.id}
                  onSelect={() => handleSelect(company.id)}
                  className='flex items-center'
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected.includes(company.id)
                        ? 'opacity-100 text-primary'
                        : 'opacity-0'
                    }`}
                  />
                  {company.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          {selected.length > 0 && (
            <div className='flex flex-wrap gap-1 p-2'>
              {selected.map((id) => {
                const company = companies.find((c) => c.id === id);
                return (
                  <Badge
                    key={id}
                    variant='secondary'
                    className='flex items-center gap-1 px-2 py-0.5 text-xs'
                  >
                    {company?.name}
                    <X
                      className='h-3 w-3 cursor-pointer ml-1'
                      onClick={() => handleSelect(id)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
          <div className='flex justify-between p-2 border-t mt-1'>
            <Button
              variant='ghost'
              size='sm'
              onClick={reset}
              className='text-xs'
            >
              Reset
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setOpen(false)}
              className='text-xs'
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
