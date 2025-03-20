'use client';
import React from 'react';
import Header from '@/components/partials/header';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/store';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useMounted } from '@/hooks/use-mounted';
import LayoutLoader from '@/components/layout-loader';
import Sidebar from '@/components/partials/sidebar';
import { useMediaQuery } from '@/hooks/use-media-query';

const DashBoardLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { collapsed } = useSidebar();
  const location = usePathname();
  const isMobile = useMediaQuery('(min-width: 768px)');
  const mounted = useMounted();

  if (!mounted) return <LayoutLoader />;

  return (
    <>
      <Header handleOpenSearch={() => {}} />
      <Sidebar />

      <div
        className={cn('content-wrapper transition-all duration-150', {
          'ltr:xl:ml-[72px] rtl:xl:mr-[72px]': collapsed,
          'ltr:xl:ml-[248px] rtl:xl:mr-[248px]': !collapsed,
        })}
      >
        <div className='layout-padding px-6 pt-6 page-min-height'>
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }}
          >
            <main>{children}</main>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashBoardLayoutProvider;
