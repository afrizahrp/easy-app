'use client';

import { useEffect, useState } from 'react';
import { iconMap } from '@/lib/iconMap';

export interface MenuItemProps {
  title: string;
  icon: any;
  href?: string;
  module_id: string;
  child?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  isHeader?: boolean; // ✅ Tambahkan properti ini
}

export const useGetMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          'http://localhost:8000/BIP/sys_menu/permissions/1'
        );
        const data = await res.json();
        // console.log(JSON.stringify(data, null, 2));
        const formattedData = (data.sidebarNav?.classic || []).map(
          (item: MenuItemProps) => ({
            ...item,
            icon: iconMap[item.icon] || iconMap['DefaultIcon'], // Konversi string ikon ke komponen
            child:
              item.child?.map((child) => ({
                ...child,
                icon: iconMap[child.icon] || iconMap['DefaultIcon'],
              })) || [],
          })
        );
        // const formattedData = data.sidebarNav?.classic || [];

        setMenuItems(formattedData);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menuItems, loading };
};
