import React from 'react';
import { useCompanyFilterStore } from '@/store/companyFilter.store';

const ChartCompanyFilter: React.FC = () => {
  const companies = useCompanyFilterStore((state) => state.companies);
  const selectedCompanyIds = useCompanyFilterStore(
    (state) => state.selectedCompanyIds
  );
  const setSelectedCompanyIds = useCompanyFilterStore(
    (state) => state.setSelectedCompanyIds
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setSelectedCompanyIds(selected);
  };

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor='company-filter' className='font-medium text-sm'>
        Pilih Perusahaan
      </label>
      <select
        id='company-filter'
        multiple
        value={selectedCompanyIds}
        onChange={handleChange}
        className='border rounded px-2 py-1 min-w-[200px]'
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChartCompanyFilter;
