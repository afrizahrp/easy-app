// lib/iconMap.ts
import { Home, Menu } from 'lucide-react';

import { DashBoard, Note2, Settings } from '@/components/svg';

export const iconMap: Record<string, React.ElementType> = {
  DashBoard: DashBoard,
  Settings: Settings,
  Home: Home,
  Menu: Menu,
  DefaultIcon: () => null, // Jika tidak ada ikon, tampilkan kosong
};
