import { DashBoard, Note2, Settings } from '@/components/svg';

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  child?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick: () => void;
  // megaMenu?: MenuItemProps[];
}

export const menusConfig = {
  sidebarNav: {
    classic: [
      {
        isHeader: true,
        title: 'Application',
      },
      {
        title: 'Inventory Management',
        href: '#',
        icon: DashBoard,
        child: [
          {
            title: 'List',
            href: '/inventory/master',
            multi_menu: [
              {
                title: 'Categories',
                href: '/inventory/categories/category-list',
              },
              {
                title: 'SubCategories',
                href: '/inventory/subcategories/subcategory-list',
              },
              {
                title: 'Unit of Measure',
                href: '/inventory/uoms/uom-list',
              },
              {
                title: 'Brands',
                href: '/inventory/brands/brand-list',
              },
              {
                title: 'Products',
                href: '/inventory/products/product-list',
              },
            ],
          },
        ],
      },

      ,
      {
        title: 'Digital Marketing',
        icon: Settings,
        child: [
          {
            title: 'Website',
            href: '/cms/master',
            multi_menu: [
              {
                title: 'Products',
                href: '/cms/products/product-list',
              },
              {
                title: 'Categories',
                href: '/cms/categories/category-list',
              },
              {
                title: 'Banner',
                href: '/cms/billboards/billboard-list',
              },
            ],
          },
        ],
      },
    ],
  },
};

export type ClassicNavType = (typeof menusConfig.sidebarNav.classic)[number];
