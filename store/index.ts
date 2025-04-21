import { create } from 'zustand';
import { siteConfig } from '@/config/site';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SortingState } from '@tanstack/react-table';

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

interface SearchParamsState {
  searchParams: Record<string, string | string[]>;
  setSearchBy: (by: string) => void;
  setSearchParam: (key: string, value: string | string[]) => void;
  removeSearchParam: (key: string) => void;
  resetSearchParams: () => void;
}

export const useSearchParamsStore = create<SearchParamsState>()(
  persist(
    (set, get) => ({
      // Inisialisasi dengan default searchBy
      searchParams: {
        searchBy: 'invoice_id', // Default untuk mencegah undefined
      },

      setSearchBy: (by) => {
        if (!by) return; // Cegah set nilai kosong atau undefined
        set((state) => ({
          searchParams: { ...state.searchParams, searchBy: by },
        }));
      },

      setSearchParam: (key, value) => {
        // Hapus param jika value kosong
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return get().removeSearchParam(key);
        }
        set((state) => ({
          searchParams: { ...state.searchParams, [key]: value },
        }));
      },

      removeSearchParam: (key) => {
        set((state) => {
          const newParams = { ...state.searchParams };
          delete newParams[key];
          return { searchParams: newParams };
        });
      },

      resetSearchParams: () => {
        set({
          searchParams: {
            searchBy: 'invoice_id', // Reset ke default
          },
        });
      },
    }),
    {
      name: 'search-params-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ searchParams: state.searchParams }),
      onRehydrateStorage: () => (state) => {
        if (typeof window === 'undefined' || !state) return;

        const params = new URLSearchParams(window.location.search);
        const searchBy = params.get('searchBy');
        const searchTerm = params.get('searchTerm');

        const newParams = { ...state.searchParams };
        if (searchBy) {
          newParams.searchBy = searchBy;
        }
        if (searchTerm) {
          newParams.searchTerm = searchTerm;
        }

        state.searchParams = newParams;
      },
    }
  )
);

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
      name: 'category-filter-store', // Nama kunci di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage
    }
  )
);

interface SalesInvoiceHdState {
  status: string[]; // Array status
  setStatus: (status: string[]) => void;
  invoiceType: string[]; // Array invoiceType
  setInvoiceType: (invoiceType: string[]) => void;
  salesPersonName: string[]; // Array salesPersonName
  setSalesPersonName: (salesPersonName: string[]) => void;
  startPeriod: Date | null;
  setStartPeriod: (startPeriod: Date | null) => void;
  endPeriod: Date | null;
  setEndPeriod: (endPeriod: Date | null) => void;
}

export const useSalesInvoiceHdFilterStore = create<SalesInvoiceHdState>()(
  persist(
    (set) => ({
      status: [],
      invoiceType: [],
      salesPersonName: [], // Array salesPersonName
      setStatus: (status) => set({ status }),
      setInvoiceType: (invoiceType) => set({ invoiceType }),
      setSalesPersonName: (salesPersonName) => set({ salesPersonName }), // Tambahkan setter untuk salesPersonName

      startPeriod: null,
      setStartPeriod: (startPeriod) => set({ startPeriod }),
      endPeriod: null,
      setEndPeriod: (endPeriod) => set({ endPeriod }),
    }),
    {
      name: 'sales-invoiceHd-filter-store', // Nama kunci di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage
    }
  )
);
