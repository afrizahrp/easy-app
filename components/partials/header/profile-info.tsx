'use client';
// import { useSession, signOut } from 'next-auth/react';
import { useAuth } from '@/provider/auth.provider';
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

const ProfileInfo = () => {
  const { session } = useAuth();

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', {
      method: 'GET',
    });
    window.location.href = '/auth/login'; // Redirect to login page after sign out
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=' cursor-pointer'>
        <div className=' flex items-center  '>
          {session?.user?.image && (
            <Image
              src={session?.user?.image}
              alt={session?.user?.email ?? ''}
              width={36}
              height={36}
              className='rounded-full'
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 p-0' align='end'>
        <DropdownMenuLabel className='flex gap-2 items-center mb-1 p-3'>
          {session?.user?.image && (
            <Image
              src={session?.user?.image}
              alt={session?.user?.email ?? ''}
              width={36}
              height={36}
              className='rounded-full'
            />
          )}
          <div>
            <div className='text-sm font-medium text-default-800 capitalize '>
              {session?.user?.name ?? 'User'}
            </div>

            <Link
              href='/dashboard'
              className='text-xs text-default-600 hover:text-primary'
            >
              {session?.user.email}
            </Link>
            <div className='text-xs font-medium text-default-500 capitalize '>
              Signed in as {session?.user?.role_name ?? 'Role'}
            </div>
          </div>
        </DropdownMenuLabel>

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
