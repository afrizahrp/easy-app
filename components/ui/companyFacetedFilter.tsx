'use client';

import * as React from 'react';
import { FacetedFilter } from './facetedFilter';
import { useCompanyFilterStore } from '@/store';

interface CompanyFacetedFilterProps {
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function CompanyFacetedFilter({
  title = 'Company',
  isLoading,
  disabled,
  ariaLabel = 'Filter by company',
}: CompanyFacetedFilterProps) {
  const { companies, selectedCompanyIds, setSelectedCompanyIds } =
    useCompanyFilterStore();

  // Convert companies to options format yang dibutuhkan FacetedFilter
  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: `${company.id} - ${company.name}`,
    displayValue: company.id, // Untuk badge display
  }));

  const handleCompanySelect = (value: string) => {
    const updated = new Set(selectedCompanyIds);
    if (updated.has(value)) {
      updated.delete(value);
    } else {
      updated.add(value);
    }
    setSelectedCompanyIds(Array.from(updated));
  };

  return (
    <FacetedFilter
      title={title}
      options={companyOptions}
      isLoading={isLoading}
      disabled={disabled}
      selectedValues={new Set(selectedCompanyIds)}
      onSelect={handleCompanySelect}
      ariaLabel={`${ariaLabel} - Company`}
    />
  );
}
