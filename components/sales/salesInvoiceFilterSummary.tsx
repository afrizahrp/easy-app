// SalesInvoiceFilterSummary.tsx
import {
  useMonthYearPeriodStore,
  useSalesInvoiceHdFilterStore,
  useCompanyFilterStore,
} from '@/store';
import { FilterSummary } from '@/components/ui/filterSummary';
import { format } from 'date-fns';

interface SalesInvoiceFilterSummaryProps {
  className?: string;
  context: 'salesInvoice' | 'salesPersonInvoice';
}

export default function SalesInvoiceFilterSummary({
  className = '',
  context,
}: SalesInvoiceFilterSummaryProps) {
  const {
    salesInvoicePeriod,
    setSalesInvoicePeriod,
    salesPersonInvoicePeriod,
    setSalesPersonInvoicePeriod,
  } = useMonthYearPeriodStore();
  const {
    salesInvoiceFilters,
    setSalesInvoiceFilters,
    salesPersonInvoiceFilters,
    setSalesPersonInvoiceFilters,
  } = useSalesInvoiceHdFilterStore();

  // Tambahkan company filter store
  const { selectedCompanyIds } = useCompanyFilterStore();

  const period =
    context === 'salesInvoice' ? salesInvoicePeriod : salesPersonInvoicePeriod;
  const setPeriod =
    context === 'salesInvoice'
      ? setSalesInvoicePeriod
      : setSalesPersonInvoicePeriod;
  const filters =
    context === 'salesInvoice'
      ? salesInvoiceFilters
      : salesPersonInvoiceFilters;
  const setFilters =
    context === 'salesInvoice'
      ? setSalesInvoiceFilters
      : setSalesPersonInvoiceFilters;

  const { paidStatus, poType, salesPersonName } = filters;

  // Fungsi untuk clear company individual
  const handleClearIndividualCompany = (companyId: string) => {
    const updatedCompanyIds = selectedCompanyIds.filter(
      (id) => id !== companyId
    );
    useCompanyFilterStore.getState().setSelectedCompanyIds(updatedCompanyIds);
  };

  // Fungsi untuk clear salesperson individual
  const handleClearIndividualSalesPerson = (salesPerson: string) => {
    setFilters({
      salesPersonName: salesPersonName.filter((name) => name !== salesPerson),
    });
  };

  // Fungsi untuk clear paidStatus individual
  const handleClearIndividualPaidStatus = (status: string) => {
    setFilters({
      paidStatus: paidStatus.filter((name) => name !== status),
    });
  };

  // Fungsi untuk clear poType individual
  const handleClearIndividualPoType = (type: string) => {
    setFilters({
      poType: poType.filter((name) => name !== type),
    });
  };

  const handleClear = (filterName: string) => {
    switch (filterName) {
      case 'startPeriod':
        setPeriod({ startPeriod: null });
        break;
      case 'endPeriod':
        setPeriod({ endPeriod: null });
        break;
      case 'paidStatus':
        setFilters({ paidStatus: [] });
        break;
      case 'poType':
        setFilters({ poType: [] });
        break;
      case 'salesPersonName':
        setFilters({ salesPersonName: [] });
        break;
      case 'company':
        useCompanyFilterStore.getState().setSelectedCompanyIds(['BIS']); // Reset ke default
        break;
      default:
        break;
    }
  };

  const defaultPeriod =
    context === 'salesInvoice' ? 'Jan 2024 - Dec 2024' : 'Jan 2025 - May 2025';

  const filtersList = [
    // Company filter di atas Period
    ...(selectedCompanyIds.length > 0
      ? [
          {
            label: 'Company',
            value: selectedCompanyIds,
            isClearable: true,
            onClear: () => handleClear('company'),
            individualValues: selectedCompanyIds,
            onClearIndividual: handleClearIndividualCompany,
          },
        ]
      : []),
    {
      label: 'Period', // Ubah label menjadi 'Period' agar sesuai dengan contoh
      value:
        period.startPeriod && period.endPeriod
          ? `${format(period.startPeriod, 'MMM yyyy')} - ${format(period.endPeriod, 'MMM yyyy')}`
          : period.startPeriod
            ? format(period.startPeriod, 'MMM yyyy')
            : defaultPeriod,
      isClearable: false,
      onClear: () => {
        setPeriod({ startPeriod: null, endPeriod: null });
      },
    },
    ...(salesPersonName.length > 0
      ? [
          {
            label: 'Salesperson',
            value: salesPersonName,
            isClearable: true,
            onClear: () => handleClear('salesPersonName'),
            individualValues: salesPersonName,
            onClearIndividual: handleClearIndividualSalesPerson,
          },
        ]
      : []),
    ...(paidStatus.length > 0
      ? [
          {
            label: 'Paid Status',
            value: paidStatus,
            isClearable: true,
            onClear: () => handleClear('paidStatus'),
            individualValues: paidStatus,
            onClearIndividual: handleClearIndividualPaidStatus,
          },
        ]
      : []),
    ...(context === 'salesInvoice' && poType.length > 0
      ? [
          {
            label: 'Po Type', // Sesuaikan kapitalisasi agar konsisten dengan contoh
            value: poType,
            isClearable: true,
            onClear: () => handleClear('poType'),
            individualValues: poType,
            onClearIndividual: handleClearIndividualPoType,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`w-full flex items-center bg-secondary text-primary dark:text-slate-400 px-2 py-2 rounded-md shadow-sm ${className}`}
    >
      <div className='w-full flex justify-center font-semibold text-md'>
        <FilterSummary
          layout='grid' // Ubah ke 'grid' untuk tampilan vertikal
          filters={filtersList}
          className='text-slate-700 dark:text-slate-400 text-lg'
        />
      </div>
    </div>
  );
}
