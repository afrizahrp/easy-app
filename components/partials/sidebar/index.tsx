'use client';
import React from 'react';
import { useSidebar } from '@/store';
import { useMediaQuery } from '@/hooks/use-media-query';
import ClassicSidebar from './classic';
import MobileSidebar from './mobile-sidebar';

const Sidebar = () => {
  const { sidebarType } = useSidebar();
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  return !isDesktop && sidebarType !== 'module' ? (
    <MobileSidebar  />
  ) : (
    sidebarType === 'classic' && <ClassicSidebar  />
  );
};

export default Sidebar;
