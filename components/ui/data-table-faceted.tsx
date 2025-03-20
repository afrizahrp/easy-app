import { useEffect } from 'react'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { FilterIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import useSelectedTermsStore from '@/store/useSelectedTermsStore'

interface DataTableFacetedProps {
  title: string
  options: { value: string; label: string }[]
  isLoading: boolean
  selectedValues: Set<string>
  onSelect?: (value: string) => void
  onClear?: () => void
  type: 'age' | 'gender' | 'lifestyle' // <-- Add this line to define type as either 'age' or 'gender'
}

export function DataTableFaceted({
  title,
  options,
  isLoading,
  selectedValues,
  onSelect,
  onClear,
  type // New prop to identify age or gender
}: DataTableFacetedProps) {
  const { addTerm, removeTerm, clearTerms } = useSelectedTermsStore()

  const handleSelect = (value: string) => {
    if (selectedValues.has(value)) {
      removeTerm(type, value) // Remove term for age or gender
    } else {
      addTerm(type, value) // Add term for age or gender
    }

    // console.log('Selected Values After:', selectedValues)
    onSelect?.(value)
  }

  const handleClear = () => {
    clearTerms() // Clear only the selected terms for age or gender
    onClear?.()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoading}
          variant='outline'
          size='sm'
          className='h-10 border-dashed text-sm text-primary w-full items-center justify-center'
        >
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          <FilterIcon className='mr-2 h-4 w-4 text-sm' />
          Targeting by {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge variant='outline' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      {selectedValues.size > 0 && (
        <div className='hidden space-x-1 py-3 lg:flex'>
          {selectedValues.size > 3 ? (
            <Badge variant='outline' className='rounded-sm px-1 font-normal'>
              {selectedValues.size} data selected
            </Badge>
          ) : (
            options?.map(
              option =>
                selectedValues.has(option.value) && (
                  <Badge variant='outline' key={option.value} className='rounded-sm px-1 text-sm flex items-center'>
                    {option.label}
                    <Cross2Icon
                      className='ml-1 h-3 w-3 cursor-pointer text-red-500'
                      onClick={() => handleSelect(option.value)} // Remove selected item on click
                    />
                  </Badge>
                )
            )
          )}
        </div>
      )}

      <PopoverContent className='w-[full] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No data</CommandEmpty>
            <CommandGroup>
              {options?.map(option => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-white opacity-50'
                      )}
                    >
                      <CheckIcon
                        className={cn('h-4 w-4', isSelected ? 'text-primary-foreground' : 'text-transparent')}
                      />
                    </div>
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleClear} className='justify-center text-center'>
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
