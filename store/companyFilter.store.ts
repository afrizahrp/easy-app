import create from 'zustand';

export interface CompanyOption {
  id: string;
  name: string;
}

interface CompanyFilterState {
  companies: CompanyOption[];
  selectedCompanyIds: string[];
  setSelectedCompanyIds: (ids: string[]) => void;
}

export const useCompanyFilterStore = create<CompanyFilterState>((set) => ({
  companies: [
    { id: 'BIS', name: 'Bumi Indah Saranamedis' },
    { id: 'BIP', name: 'Bumi Indah Putra' },
    { id: 'KBIP', name: 'Karoseri' },
  ],
  selectedCompanyIds: ['BIS'],
  setSelectedCompanyIds: (ids) => set({ selectedCompanyIds: ids }),
}));
