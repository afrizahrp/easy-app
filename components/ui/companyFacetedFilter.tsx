import { FacetedFilter } from '@/components/ui/facetedFilter';
import { useCompanyFilterStore } from '@/store';

const companyOptions = [
  { value: 'BIS', label: 'BIS' },
  { value: 'BIP', label: 'BIP' },
  { value: 'KBIP', label: 'KBIP' },
];

export default function CompanyFacetedFilter() {
  const selected = useCompanyFilterStore((s) => s.selectedCompanyIds);
  const setSelected = useCompanyFilterStore((s) => s.setSelectedCompanyIds);

  const handleSelect = (value: string) => {
    const updated = new Set(selected);
    updated.has(value) ? updated.delete(value) : updated.add(value);
    setSelected(Array.from(updated));
  };

  return (
    <div className='mb-2'>
      <FacetedFilter
        title='Company'
        options={companyOptions}
        selectedValues={new Set(selected)}
        onSelect={handleSelect}
        ariaLabel='Filter by company'
      />
    </div>
  );
}
