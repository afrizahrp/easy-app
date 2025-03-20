'use client';
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { api } from '@/config/axios.config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Company {
  value: string;
  label: string;
  companyLogo?: string;
}
interface CompanyComboboxProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onSelect?: (company: Company) => void; // Tambahkan prop onSelect
}

const CompanyCombobox: React.FC<CompanyComboboxProps> = ({
  className,
  value,
  onChange,
  disabled,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchSysCompany = async () => {
      try {
        const response = await api.get('/sys_company');

        const transformedData = response.data.map((item: any) => ({
          value: item.id.toLowerCase(),
          label: item.name,
          companyLogo: item.companyLogo,
        }));
        setCompanies(transformedData);
      } catch (error) {
        console.error('Error fetching sys_company:', error);
      }
    };
    fetchSysCompany();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between w-full', className)}
        >
          {value
            ? companies.find((company) => company.value === value)?.label
            : 'Select a company...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <Command>
          <CommandInput placeholder='Search a company...' />
          <CommandEmpty>No company found.</CommandEmpty>
          <CommandGroup>
            {companies.map((company) => (
              <CommandItem
                key={company.value}
                value={company.value}
                disabled={disabled}
                onSelect={() => {
                  onChange(company.value); // Kirim value ke form
                  onSelect?.(company); // Kirim seluruh data perusahaan ke parent component
                  setOpen(false);
                }}
              >
                {/* onSelect={(currentValue) => {
                  onChange(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              > */}
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === company.value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {company.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CompanyCombobox;
