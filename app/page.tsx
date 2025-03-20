import React from 'react';
import LoginForm from '@/app/auth/(login)/login/login-form';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <div className='space-y-6'>
        <LoginForm />
      </div>
    </main>
  );
}
