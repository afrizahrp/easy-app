'use client';
import { useSessionStore, useCompanyInfo } from '@/store'; // Impor useCompanyInfo
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import CompanyCombobox from '@/components/ui/company-combobox'; // Impor CompanyCombobox

const ProfileInfo = () => {
  const { user, logout, updateCompanyId } = useSessionStore();
  const { setCompany } = useCompanyInfo(); // Ambil setCompany dari useCompanyInfo

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
      logout();
      setCompany({ companyName: '', companyLogo: '' }); // Reset company information on logout
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    updateCompanyId(companyId); // Update company_id di useSessionStore
    console.log('Selected company_id:', companyId);
  };

  const handleCompanySelect = (company: {
    value: string;
    label: string;
    companyLogo?: string;
  }) => {
    // Simpan informasi perusahaan ke useCompanyInfo
    setCompany({
      companyName: company.label,
      companyLogo: company.companyLogo || '',
    });
    console.log('Selected company:', company);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer'>
        <div className='flex items-center'>
          {user?.image && (
            <Image
              src={user?.image}
              alt={user?.email ?? ''}
              width={36}
              height={36}
              className='rounded-full'
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-70 p-0' align='end'>
        <DropdownMenuLabel className='flex gap-2 items-center mb-1 p-3'>
          {user?.image && (
            <Image
              src={user?.image}
              alt={user?.email ?? ''}
              width={36}
              height={36}
              className='rounded-full'
            />
          )}
          <div>
            <div className='text-sm font-medium text-default-800 capitalize'>
              {user?.name ?? 'User'}
            </div>
            <Link
              href='/dashboard'
              className='text-xs text-default-600 hover:text-primary'
            >
              {user?.email}
            </Link>
            <div className='text-xs font-medium text-default-500 capitalize'>
              Signed in as {user?.role_id ?? 'Role'}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className='mb-0 dark:bg-background' />

        {/* Tambahkan CompanyCombobox */}
        <div className='px-3 py-2'>
          <CompanyCombobox
            value={user?.company_id || ''} // Nilai awal dari user.company_id
            onChange={handleCompanyChange} // Update company_id saat dipilih
            onSelect={handleCompanySelect} // Simpan informasi perusahaan
            disabled={!user} // Nonaktifkan jika user tidak ada
            className='w-full text-xs'
          />
        </div>

        <DropdownMenuSeparator className='mb-0 dark:bg-background' />

        <DropdownMenuItem
          onSelect={handleSignOut}
          className='flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer'
        >
          <Icon icon='heroicons:power' className='w-4 h-4' />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileInfo;
