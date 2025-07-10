'use client';

import { signIn } from '@/lib/auth';
import { FcGoogle } from 'react-icons/fc';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { BACKEND_URL } from '@/lib/constants';

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl');

  const onClick = (provider: 'google' | 'github') => {
    console.log('onClick', provider, callbackUrl);
    // signIn(provider, {
    //   callbackUrl: callbackUrl || BACKEND_URL,
    // });
  };

  return (
    <div className='flex items-center w-full gap-x-2'>
      <a
        className='border px-4 py-2 rounded bg-sky-600 text-white'
        href={`${BACKEND_URL}/auth/google/login`}
      >
        Sign in with Google
      </a>

      {/* <Button
        size='sm'
        className='w-full relative'
        variant='outline'
        // className='w-full bg-white text-black hover:bg-customGreen hover:text-white'

        onClick={() => onClick('google')}
      >
        <FcGoogle className='size-5 absolute top-2.5 left-2.5' />
        Login with google account
      </Button> */}
    </div>
  );
};
