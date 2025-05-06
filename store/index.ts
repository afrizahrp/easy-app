import { create } from 'zustand';
import { siteConfig } from '@/config/site';
import { persist, PersistOptions, createJSONStorage } from 'zustand/middleware';
import { SortingState } from '@tanstack/react-table';

import { SearchContext, SEARCH_CONTEXTS } from '@/constants/searchContexts';
import { makeInitialSearchParams } from '@/utils/makeInitialSearchParams';
import { startOfMonth, endOfMonth, set as setDate } from 'date-fns';

interface ThemeStoreState {
  theme: string;
  setTheme: (theme: string) => void;
  radius: number;
  setRadius: (value: number) => void;
  layout: string;
  setLayout: (value: string) => void;
  navbarType: string;
  setNavbarType: (value: string) => void;
  footerType: string;
  setFooterType: (value: string) => void;
  isRtl: boolean;
  setRtl: (value: boolean) => void;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      theme: siteConfig.theme,
      setTheme: (theme) => set({ theme }),
      radius: siteConfig.radius,
      setRadius: (value) => set({ radius: value }),
      layout: siteConfig.layout,
      setLayout: (value) => {
        set({ layout: value });

        // If the new layout is "semibox," also set the sidebarType to "popover"
        if (value === 'semibox') {
          useSidebar.setState({ sidebarType: 'popover' });
        }
        if (value === 'horizontal') {
          useSidebar.setState({ sidebarType: 'classic' });
        }
        //
        if (value === 'horizontal') {
          // update  setNavbarType
          useThemeStore.setState({ navbarType: 'sticky' });
        }
      },
      navbarType: siteConfig.navbarType,
      setNavbarType: (value) => set({ navbarType: value }),
      footerType: siteConfig.footerType,
      setFooterType: (value) => set({ footerType: value }),
      isRtl: false,
      setRtl: (value) => set({ isRtl: value }),
    }),
    { name: 'theme-store', storage: createJSONStorage(() => localStorage) }
  )
);

interface PageState {
  currentPage: number;
  sorting: SortingState;
  limit: number; // Tambah limit
  setCurrentPage: (page: number) => void;
  setSorting: (
    sorting: SortingState | ((old: SortingState) => SortingState)
  ) => void;
  setLimit: (limit: number) => void; // Tambah setLimit
}

export const usePageStore = create<PageState>()(
  persist(
    (set, get) => ({
      currentPage: 1,
      sorting: [],
      limit: 10,
      setCurrentPage: (page) => {
        // console.log('usePageStore: Setting currentPage:', page); // Debug
        set({ currentPage: page });
      },
      setSorting: (updater) => {
        // console.log('usePageStore: Before setSorting:', get().sorting);
        // console.log('usePageStore: Updater:', updater);
        const newSorting =
          typeof updater === 'function' ? updater(get().sorting) : updater;
        // console.log('usePageStore: New sorting:', newSorting);
        set({ sorting: newSorting });
        // console.log('usePageStore: After setSorting:', get().sorting);
      },
      setLimit: (limit) => {
        // console.log('usePageStore: Setting limit:', limit); // Debug
        if ([5, 10, 20].includes(limit)) {
          // console.log('usePageStore: Valid limit, updating state to:', limit); // Debug
          set({ limit, currentPage: 1 });
        } else {
          console.warn('usePageStore: Invalid limit value:', limit);
        }
      },
    }),
    {
      name: 'page-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface SidebarState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  sidebarType: string;
  setSidebarType: (value: string) => void;
  subMenu: boolean;
  setSubmenu: (value: boolean) => void;
  // background image
  sidebarBg: string;
  setSidebarBg: (value: string) => void;
  mobileMenu: boolean;
  setMobileMenu: (value: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (value) => set({ collapsed: value }),
      sidebarType:
        siteConfig.layout === 'semibox' ? 'popover' : siteConfig.sidebarType,
      setSidebarType: (value) => {
        set({ sidebarType: value });
      },
      subMenu: false,
      setSubmenu: (value) => set({ subMenu: value }),
      // background image
      sidebarBg: siteConfig.sidebarBg,
      setSidebarBg: (value) => set({ sidebarBg: value }),
      mobileMenu: false,
      setMobileMenu: (value) => set({ mobileMenu: value }),
    }),
    { name: 'sidebar-store', storage: createJSONStorage(() => localStorage) }
  )
);

interface MenuModuleState {
  moduleId: string | null;
  setModuleId: (id: string) => void;
}

export const useModuleStore = create<MenuModuleState>()(
  persist(
    (set) => ({
      moduleId: null,
      setModuleId: (id: string) => set({ moduleId: id.toUpperCase() }), // Pastikan id dalam huruf besar
    }),
    { name: 'module-store', storage: createJSONStorage(() => localStorage) }
  )
);

interface UserSession {
  name: string;
  company_id: string;
  role_id: string;
  image: string;
  email: string;
}

interface SessionStoreState {
  user: UserSession | null;
  setUser: (user: UserSession) => void;
  updateCompanyId: (companyId: string) => void; // Tambahkan fungsi ini
  logout: () => void;
}

export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateCompanyId: (companyId) =>
        set((state) => ({
          user: state.user ? { ...state.user, company_id: companyId } : null,
        })),
      logout: () => set({ user: null }),
    }),
    {
      name: 'session-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface CompanyInfoState {
  companyName: string;
  companyLogo: string;
}

interface CompanyInfoStoreState {
  company: CompanyInfoState | null;
  setCompany: (company: CompanyInfoState) => void;
}

export const useCompanyInfo = create<CompanyInfoStoreState>()(
  persist(
    (set) => ({
      company: null,
      setCompany: (company) => set({ company }),
    }),
    {
      name: 'company-info-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface SearchParams {
  searchBy?: string;
  searchTerm?: string;
}

interface SearchParamsState {
  searchParams: Record<SearchContext, SearchParams>;
  setSearchParam: (
    context: SearchContext,
    key: keyof SearchParams,
    value: string
  ) => void;
  removeSearchParam: (context: SearchContext, key: keyof SearchParams) => void;
  resetSearchParams: (context: SearchContext) => void;
}

export const useSearchParamsStore = create<SearchParamsState>()(
  persist(
    (set) => ({
      searchParams: makeInitialSearchParams(),
      setSearchParam: (context, key, value) =>
        set((state) => {
          if (!SEARCH_CONTEXTS.includes(context)) {
            console.warn(`Invalid context: ${context}`);
            return state;
          }
          const newState = {
            searchParams: {
              ...state.searchParams,
              [context]: {
                ...state.searchParams[context],
                [key]: value,
              },
            },
          };
          console.log(`Setting ${context}.${key} to ${value}`, newState);
          return newState;
        }),
      removeSearchParam: (context, key) =>
        set((state) => {
          if (!SEARCH_CONTEXTS.includes(context)) {
            console.warn(`Invalid context: ${context}`);
            return state;
          }
          const updated = { ...state.searchParams[context] };
          delete updated[key];
          console.log(`Removing ${context}.${key}`, updated);
          return {
            searchParams: {
              ...state.searchParams,
              [context]: updated,
            },
          };
        }),
      resetSearchParams: (context) =>
        set((state) => {
          if (!SEARCH_CONTEXTS.includes(context)) {
            console.warn(`Invalid context: ${context}`);
            return state;
          }
          console.log(`Resetting ${context} search params`);
          return {
            searchParams: {
              ...state.searchParams,
              [context]: { searchBy: 'invoice_id', searchTerm: '' },
            },
          };
        }),
    }),
    {
      name: 'search-params-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ searchParams: state.searchParams }),
    }
  )
);

export const useSearchParams = (context: SearchContext) =>
  useSearchParamsStore((state) => ({
    searchBy: state.searchParams[context]?.searchBy || 'invoice_id',
    searchTerm: state.searchParams[context]?.searchTerm || '',
    setSearchParam: state.setSearchParam,
    removeSearchParam: state.removeSearchParam,
    resetSearchParams: state.resetSearchParams,
  }));

interface CategoryFilterState {
  status: string[]; // Array status
  categoryType: string[]; // Array categoryType
  setStatus: (status: string[]) => void;
  setCategoryType: (categoryType: string[]) => void;
}

export const useCategoryFilterStore = create<CategoryFilterState>()(
  persist(
    (set) => ({
      status: [],
      categoryType: [],
      setStatus: (status) => set({ status }),
      setCategoryType: (categoryType) => set({ categoryType }), // Tambahkan setter untuk categoryType
    }),
    {
      name: 'category-store', // Nama kunci di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage
    }
  )
);

interface YearlyPeriodStore {
  selectedYears: string[];
  setYears: (years: string[]) => void;
  resetYears: () => void;
}

const getDefaultYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  return [`${currentYear - 1}`, `${currentYear}`]; // Misalnya, ["2024", "2025"]
};

export const useYearlyPeriodStore = create<YearlyPeriodStore>()(
  persist(
    (set) => ({
      selectedYears: getDefaultYears(),
      setYears: (years) => set({ selectedYears: years }),
      resetYears: () => set({ selectedYears: getDefaultYears() }),
    }),
    {
      name: 'yearly-period-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
interface PeriodState {
  startPeriod: Date | null;
  endPeriod: Date | null;
}

interface PersistedPeriodState {
  startPeriod: string | null;
  endPeriod: string | null;
}

interface PersistedMonthYearPeriodState {
  salesInvoicePeriod: PersistedPeriodState;
  salesPersonInvoicePeriod: PersistedPeriodState;
  purchasingPeriod: PersistedPeriodState;
  inventoryPeriod: PersistedPeriodState;
}

interface MonthYearPeriodState {
  salesInvoicePeriod: PeriodState;
  salesPersonInvoicePeriod: PeriodState;
  purchasingPeriod: PeriodState;
  inventoryPeriod: PeriodState;
  setSalesInvoicePeriod: (period: Partial<PeriodState>) => void;
  setSalesPersonInvoicePeriod: (period: Partial<PeriodState>) => void;
  setPurchasingPeriod: (period: Partial<PeriodState>) => void;
  setInventoryPeriod: (period: Partial<PeriodState>) => void;
  resetSalesInvoicePeriod: () => void;
  resetSalesPersonInvoicePeriod: () => void;
  resetPurchasingPeriod: () => void;
  resetInventoryPeriod: () => void;
}

type MonthYearPeriodStore = MonthYearPeriodState & {
  $$storeMutators?: [['zustand/persist', PersistedMonthYearPeriodState]];
};

const currentYear = new Date().getFullYear();
const toISOString = (date: Date | null) => (date ? date.toISOString() : null);
const fromISOString = (dateString: string | null) =>
  dateString ? new Date(dateString) : null;

const getDefaultPeriod = (): PeriodState => ({
  startPeriod: setDate(startOfMonth(new Date(currentYear, 0, 1)), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  }),
  endPeriod: setDate(endOfMonth(new Date()), {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  }),
});

const persistOptions: PersistOptions<
  MonthYearPeriodState,
  PersistedMonthYearPeriodState
> = {
  name: 'monthYearFilterStore',
  storage: createJSONStorage(() => localStorage),
  partialize: (state: MonthYearPeriodState): PersistedMonthYearPeriodState => ({
    salesInvoicePeriod: {
      startPeriod: toISOString(state.salesInvoicePeriod.startPeriod),
      endPeriod: toISOString(state.salesInvoicePeriod.endPeriod),
    },
    salesPersonInvoicePeriod: {
      startPeriod: toISOString(state.salesPersonInvoicePeriod.startPeriod),
      endPeriod: toISOString(state.salesPersonInvoicePeriod.endPeriod),
    },
    purchasingPeriod: {
      startPeriod: toISOString(state.purchasingPeriod.startPeriod),
      endPeriod: toISOString(state.purchasingPeriod.endPeriod),
    },
    inventoryPeriod: {
      startPeriod: toISOString(state.inventoryPeriod.startPeriod),
      endPeriod: toISOString(state.inventoryPeriod.endPeriod),
    },
  }),
  onRehydrateStorage: () => (state) => {
    if (state) {
      // Konversi string ISO ke Date, fallback ke default jika tidak valid
      state.salesInvoicePeriod.startPeriod =
        fromISOString(
          typeof state.salesInvoicePeriod.startPeriod === 'string'
            ? state.salesInvoicePeriod.startPeriod
            : null
        ) || getDefaultPeriod().startPeriod;
      state.salesInvoicePeriod.endPeriod =
        fromISOString(
          typeof state.salesInvoicePeriod.endPeriod === 'string'
            ? state.salesInvoicePeriod.endPeriod
            : null
        ) || getDefaultPeriod().endPeriod;
      state.salesPersonInvoicePeriod.startPeriod =
        fromISOString(
          typeof state.salesPersonInvoicePeriod.startPeriod === 'string'
            ? state.salesPersonInvoicePeriod.startPeriod
            : null
        ) || getDefaultPeriod().startPeriod;
      state.salesPersonInvoicePeriod.endPeriod =
        fromISOString(
          typeof state.salesPersonInvoicePeriod.endPeriod === 'string'
            ? state.salesPersonInvoicePeriod.endPeriod
            : null
        ) || getDefaultPeriod().endPeriod;
      state.purchasingPeriod.startPeriod =
        fromISOString(
          typeof state.purchasingPeriod.startPeriod === 'string'
            ? state.purchasingPeriod.startPeriod
            : null
        ) || getDefaultPeriod().startPeriod;
      state.purchasingPeriod.endPeriod =
        fromISOString(
          typeof state.purchasingPeriod.endPeriod === 'string'
            ? state.purchasingPeriod.endPeriod
            : null
        ) || getDefaultPeriod().endPeriod;
      state.inventoryPeriod.startPeriod =
        fromISOString(
          typeof state.inventoryPeriod.startPeriod === 'string'
            ? state.inventoryPeriod.startPeriod
            : null
        ) || getDefaultPeriod().startPeriod;
      state.inventoryPeriod.endPeriod =
        fromISOString(
          typeof state.inventoryPeriod.endPeriod === 'string'
            ? state.inventoryPeriod.endPeriod
            : null
        ) || getDefaultPeriod().endPeriod;
    }
  },
};

export const useMonthYearPeriodStore = create<MonthYearPeriodStore>()(
  persist(
    (set) => ({
      salesInvoicePeriod: getDefaultPeriod(),
      salesPersonInvoicePeriod: getDefaultPeriod(),
      purchasingPeriod: getDefaultPeriod(),
      inventoryPeriod: getDefaultPeriod(),
      setSalesInvoicePeriod: (period) =>
        set((state) => ({
          salesInvoicePeriod: { ...state.salesInvoicePeriod, ...period },
        })),
      setSalesPersonInvoicePeriod: (period) =>
        set((state) => ({
          salesPersonInvoicePeriod: {
            ...state.salesPersonInvoicePeriod,
            ...period,
          },
        })),
      setPurchasingPeriod: (period) =>
        set((state) => ({
          purchasingPeriod: { ...state.purchasingPeriod, ...period },
        })),
      setInventoryPeriod: (period) =>
        set((state) => ({
          inventoryPeriod: { ...state.inventoryPeriod, ...period },
        })),
      resetSalesInvoicePeriod: () =>
        set({
          salesInvoicePeriod: getDefaultPeriod(),
        }),
      resetSalesPersonInvoicePeriod: () =>
        set({
          salesPersonInvoicePeriod: getDefaultPeriod(),
        }),
      resetPurchasingPeriod: () =>
        set({
          purchasingPeriod: getDefaultPeriod(),
        }),
      resetInventoryPeriod: () =>
        set({
          inventoryPeriod: getDefaultPeriod(),
        }),
    }),
    persistOptions
  )
);

interface FilterState {
  paidStatus: string[];
  poType: string[];
  salesPersonName: string[];
}

interface SalesInvoiceFilterState {
  salesInvoiceFilters: FilterState;
  salesPersonInvoiceFilters: FilterState;
  setSalesInvoiceFilters: (filters: Partial<FilterState>) => void;
  setSalesPersonInvoiceFilters: (filters: Partial<FilterState>) => void;
  resetSalesInvoiceFilters: () => void;
  resetSalesPersonInvoiceFilters: () => void;
}
export const useSalesInvoiceHdFilterStore = create<SalesInvoiceFilterState>()(
  persist(
    (set) => ({
      salesInvoiceFilters: {
        paidStatus: [],
        poType: [],
        salesPersonName: [],
      },
      salesPersonInvoiceFilters: {
        paidStatus: [],
        poType: [],
        salesPersonName: [],
      },
      setSalesInvoiceFilters: (filters) =>
        set((state) => ({
          salesInvoiceFilters: { ...state.salesInvoiceFilters, ...filters },
        })),
      setSalesPersonInvoiceFilters: (filters) =>
        set((state) => ({
          salesPersonInvoiceFilters: {
            ...state.salesPersonInvoiceFilters,
            ...filters,
          },
        })),
      resetSalesInvoiceFilters: () =>
        set({
          salesInvoiceFilters: {
            paidStatus: [],
            poType: [],
            salesPersonName: [],
          },
        }),
      resetSalesPersonInvoiceFilters: () =>
        set({
          salesPersonInvoiceFilters: {
            paidStatus: [],
            poType: [],
            salesPersonName: [],
          },
        }),
    }),
    {
      name: 'sales-invoice-filter',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
