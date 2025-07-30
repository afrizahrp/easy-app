import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CompanyOption {
  id: string;
  name: string;
}

interface CompanyFilterState {
  companies: CompanyOption[];
  selectedCompanyIds: string[];
  setSelectedCompanyIds: (ids: string[]) => void;
}

export const useCompanyFilterStore = create<CompanyFilterState>()(
  persist(
    (set) => ({
      companies: [
        { id: 'BIS', name: 'Bumi Indah Saranamedis' },
        { id: 'BIP', name: 'Bumi Indah Putra' },
        { id: 'KBIP', name: 'Karoseri' },
      ],
      selectedCompanyIds: ['BIS'],
      setSelectedCompanyIds: (ids) => set({ selectedCompanyIds: ids }),
    }),
    {
      name: 'company-filter-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
