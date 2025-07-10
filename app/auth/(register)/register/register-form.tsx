'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/utils/schema/login.schema';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { BACKEND_URL } from '@/lib/constants';
// import CompanyCombobox from '@/components/ui/company-combobox';

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [passwordType, setPasswordType] = useState('password');

  const togglePasswordType = () => {
    setPasswordType((prevType) =>
      prevType === 'password' ? 'text' : 'password'
    );
  };
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: 'afriza-bip',
      password: '1234567',
      email: 'afriza@mail.com',
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      try {
        const response = await fetch(BACKEND_URL + '/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: values.name,
            password: values.password,
            email: values.email,
            role_id: 1,
            // company_id: 'BIS',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setSuccess('Registration successful');
          window.location.assign('/dashboard');
          form.reset();
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed');
        }
      } catch (error: any) {
        setError(error.message || 'Registration failed');
        setSuccess('');
      }
    });
  };

  return (
    <CardWrapper
      headerLabel='Create an account'
      backButtonLabel='Already have an account?'
      backButtonHref='/auth/login'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='Your name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='yourname@example.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='Please enter your password'
                        type={passwordType === 'password' ? 'password' : 'text'}
                        className='border-gray-300 dark:border-gray-600 
                                             bg-white dark:bg-gray-800 
                                             text-gray-900 dark:text-gray-100 w-full'
                      />
                      <div
                        className='absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer'
                        onClick={togglePasswordType}
                      >
                        {passwordType === 'password' ? (
                          <Icon
                            icon='heroicons:eye'
                            className='w-4 h-4 text-gray-500 dark:text-gray-400'
                          />
                        ) : (
                          <Icon
                            icon='heroicons:eye-slash'
                            className='w-4 h-4 text-gray-500 dark:text-gray-400'
                          />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type='submit' className='w-full'>
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
