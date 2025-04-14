import { create } from 'zustand';
import { siteConfig } from '@/config/site';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow'; // Hindari re-render yang tidak perlu

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
  setCurrentPage: (page: number) => void;
}
export const usePageStore = create<PageState>()(
  persist(
    (set) => ({
      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'page-store', // Nama kunci di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage
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
      setModuleId: (id: string) => set({ moduleId: id }),
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
  // id: string;
  // branch_id: string;
}

interface SessionStoreState {
  user: UserSession | null;
  setUser: (user: UserSession) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
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
  searchParams: Record<string, string | string[]>; // Bisa untuk semua parameter
  setSearchParam: (key: string, value: string | string[]) => void;
  removeSearchParam: (key: string) => void; // ✅ Perbaikan di sini
}

export const useSearchParamsStore = create<SearchParamsState>()(
  persist(
    (set) => ({
      searchParams: {}, // Awal kosong, bisa menampung banyak filter

      setSearchParam: (key, value) =>
        set((state) => ({
          searchParams: { ...state.searchParams, [key]: value },
        })),

      removeSearchParam: (key) =>
        set((state) => {
          const newParams = { ...state.searchParams };
          delete newParams[key];
          return { searchParams: newParams };
        }),
    }),
    {
      name: 'search-params-store', // Nama kunci di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage
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

interface InvoiceHdFilterState {
  status: string[]; // Array status
  setStatus: (status: string[]) => void;
  invoiceType: string[]; // Array invoiceType
  setInvoiceType: (invoiceType: string[]) => void;
}

export const useInvoiceHdFilterStore = create<InvoiceHdFilterState>()(
  persist(
    (set) => ({
      status: [],
      invoiceType: [],
      setStatus: (status) => set({ status }),
      setInvoiceType: (invoiceType) => set({ invoiceType }), // Tambahkan setter untuk invoiceType
    }),
    {
      name: 'invoiceHd-filter-store', // Nama kunci di localStorage
      storage: createJSONStorage(() => localStorage), // Gunakan localStorage
    }
  )
);
