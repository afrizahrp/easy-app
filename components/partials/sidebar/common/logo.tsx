import Image from 'next/image';
import React from 'react';
import { useCompanyInfo } from '@/store';

const SidebarLogo = ({ hovered }: { hovered?: boolean }) => {
  const { company } = useCompanyInfo((state) => ({
    company: state.company,
  }));

  const logoSrc = company?.companyLogo || '/images/logo/logo.png';

  return (
    <div className='flex flex-col gap-0.5 leading-none'>
      <div className='flex justify-center items-center'>
        <Image
          src={logoSrc}
          alt='sidebar-logo'
          width={90}
          height={60}
          priority
        />
      </div>
    </div>
  );
};

export default SidebarLogo;
