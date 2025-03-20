'use client';

import { FaUser } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LogoutButton } from '@/components/auth/logout-button';

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=' cursor-pointer'>
        <div className=' flex items-center  '>
          <Avatar>
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback className='bg-sky-500'>
              <FaUser className='text-white' />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 p-0' align='end'>
        <DropdownMenuLabel className='flex gap-2 items-center mb-1 p-3'>
          {user?.image && (
            <Image
              src={user?.image ?? ''}
              alt={user?.name ?? ''}
              width={36}
              height={36}
              className='rounded-full'
            />
          )}
          <div>
            <div className='text-sm font-medium text-default-800 capitalize '>
              {user?.name ?? 'user'}
            </div>
            <Link
              href='/dashboard'
              className='text-xs text-default-600 hover:text-primary'
            >
              {/* {user?.email} */}
              admin@myemail.com
            </Link>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className='mb-0 dark:bg-background' />
        <LogoutButton>
          <DropdownMenuItem className='flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 dark:hover:bg-background cursor-pointer'>
            <Icon icon='heroicons:power' className='w-4 h-4 mr-2' />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
