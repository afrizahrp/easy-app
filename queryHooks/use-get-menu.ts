'use client';

import { useEffect, useState } from 'react';
import { iconMap } from '@/lib/iconMap';
import { useSessionStore } from '@/store';

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
  const user = useSessionStore((state) => state.user);
  const company_id = user?.company_id;
  const role_id = 1; /**user?.role_id**/

  const url = `${process.env.NEXT_PUBLIC_API_URL}/${company_id}/sys_menu/permissions/${role_id}`;

  useEffect(() => {
    if (!company_id || !role_id) return; // Hindari fetch jika data belum ada

    const fetchMenu = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
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

        setMenuItems(formattedData);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [company_id, role_id]);

  return { menuItems, loading };
};
