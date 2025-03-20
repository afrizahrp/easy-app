import { useSidebar } from '@/store';
import Image from 'next/image';
import React from 'react';
import { Pin } from 'lucide-react';
// import { useSession } from 'next-auth/react';
import { useAuth } from '@/provider/auth.provider';

const SidebarLogo = ({ hovered }: { hovered?: boolean }) => {
  const { sidebarType, setCollapsed, collapsed } = useSidebar();
  // const { data: session } = useSession();
  const { session } = useAuth();
  // console.log('Session from sidebarLogo:', session); // Debugging log
  const companyId = session?.user?.company_id;

  // Pemetaan companyId ke nama perusahaan
  let companyName = '';
  let logoSrc = '/images/logo/logo.png'; // Default logo

  if (companyId === 'BIS') {
    companyName = 'Bumi Indah Saranamedis';
  } else if (companyId === 'BIP') {
    companyName = 'Bumi Indah Putra';
    logoSrc = '/images/logo/bipmed-logo.png'; // Logo untuk BIP
  } else if (companyId === 'KBIP') {
    companyName = 'Karoseri Bumi Indah Putra';
    logoSrc = '/images/logo/bipmed-logo.png'; // Logo untuk KBIP
  }

  return (
    <div className='px-4 py-4 '>
      <div className='flex items-center justify-center flex-col relative'>
        <div className='flex justify-center items-center'>
          <Image
            src={logoSrc}
            alt='sidebar-logo'
            width={100}
            height={100}
            priority
          />
        </div>
        {sidebarType === 'classic' && (!collapsed || hovered) && (
          <div className='flex-none'>
            <div
              onClick={() => setCollapsed(!collapsed)}
              className={`absolute top-0 right-0 h-8 w-8 flex items-center justify-center border-[1.5px] border-default-900 dark:border-default-200 rounded-full transition-all duration-150
          ${
            collapsed
              ? ''
              : 'bg-blue-700 text-white dark:bg-default-300 dark:text-white'
          }
          `}
            >
              <Pin className='h-4 w-4 border-none' />
            </div>
          </div>
        )}
      </div>
      {(!collapsed || hovered) && (
        <div className='text-md text-primary font-semibold mt-1 text-center'>
          {companyName}
        </div>
      )}
    </div>
  );
};

export default SidebarLogo;
