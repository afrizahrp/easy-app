'use client';

import { FcGoogle } from 'react-icons/fc';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constants';

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  const onClick = () => {
    const redirectUrl = `${BACKEND_URL}/auth/google/login${
      callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''
    }`;
    console.log('Redirecting to Google login:', redirectUrl);
    window.location.href = redirectUrl;
  };

  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size='default'
        className='w-full bg-white text-black hover:bg-gray-100 border border-gray-300 flex items-center justify-center gap-2'
        onClick={onClick}
      >
        <FcGoogle className='size-5' />
        Sign in with Google
      </Button>
    </div>
  );
};
