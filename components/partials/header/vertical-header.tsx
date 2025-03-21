import React from 'react';
import { useSidebar, useThemeStore } from '@/store';
import { cn } from '@/lib/utils';
import SidebarToggle from '../sidebar/common/sidebar-toggle';
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/use-media-query';
import Image from 'next/image';
import { useCompanyInfo } from '@/store';

const MenuBar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) => {
  return (
    <button
      className='relative group  disabled:cursor-not-allowed opacity-50'
      onClick={() => setCollapsed(!collapsed)}
    >
      <div>
        <div
          className={cn(
            'flex flex-col justify-between w-[20px] h-[16px] transform transition-all duration-300 origin-center overflow-hidden',
            {
              '-translate-x-1.5 rotate-180': collapsed,
            }
          )}
        >
          <div
            className={cn(
              'bg-card-foreground h-[2px] transform transition-all duration-300 origin-left delay-150',
              {
                'rotate-[42deg] w-[11px]': collapsed,
                'w-7': !collapsed,
              }
            )}
          ></div>
          <div
            className={cn(
              'bg-card-foreground h-[2px] w-7 rounded transform transition-all duration-300',
              {
                'translate-x-10': collapsed,
              }
            )}
          ></div>
          <div
            className={cn(
              'bg-card-foreground h-[2px] transform transition-all duration-300 origin-left delay-150',
              {
                '-rotate-[43deg] w-[11px]': collapsed,
                'w-7': !collapsed,
              }
            )}
          ></div>
        </div>
      </div>
    </button>
  );
};

const VerticalHeader: React.FC = () => {
  const { collapsed, setCollapsed, subMenu, sidebarType } = useSidebar();
  const { layout } = useThemeStore();
  const { company } = useCompanyInfo((state) => ({
    company: state.company,
  }));

  const isDesktop = useMediaQuery('(min-width: 1280px)');
  const isMobile = useMediaQuery('(min-width: 768px)');
  let LogoContent = null;
  let menuBarContent = null;
  let searchButtonContent = null;

  const logoSrc = company?.companyLogo || '/images/logo/logo.png';
  const companyName = company?.companyName || 'PT. BUMI INDAH SARANAMEDIS';

  const MainLogo = (
    <Link href='/dashboard' className=' text-primary '>
      <Image src={logoSrc} alt='sidebar-logo' width={60} height={60} priority />
    </Link>
  );
  {
  }

  const SearchButton = (
    <div className='flex items-center gap-2'>
      <SidebarToggle />
      <span className='md:block'>{companyName}</span>
    </div>
  );

  if (
    layout === 'vertical' &&
    !isDesktop &&
    isMobile &&
    sidebarType === 'module'
  ) {
    LogoContent = MainLogo;
  }
  if (layout === 'vertical' && !isDesktop && sidebarType !== 'module') {
    LogoContent = MainLogo;
  }

  // menu bar content condition
  if (isDesktop && sidebarType !== 'module') {
    menuBarContent = (
      <MenuBar collapsed={collapsed} setCollapsed={setCollapsed} />
    );
  }

  if (sidebarType === 'classic') {
    menuBarContent = null;
  }
  if (subMenu && isDesktop) {
    menuBarContent = null;
  }

  if (sidebarType === 'classic' || sidebarType === 'popover') {
    searchButtonContent = SearchButton;
  }
  return (
    <>
      <div className='flex items-center md:gap-6 gap-3'>
        {LogoContent}
        {menuBarContent}
        {searchButtonContent}
      </div>
    </>
  );
};

export default VerticalHeader;
