'use client';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { LoginSchema } from '@/utils/schema/login.schema';
import { useMediaQuery } from '@/hooks/use-media-query';
import CompanyCombobox from '@/components/ui/company-combobox';

interface Company {
  value: string;
  label: string;
  companyLogo?: string;
}

const LogInForm = () => {
  const [isPending, startTransition] = useTransition();
  const [passwordType, setPasswordType] = useState('password');
  const isDesktop2xl = useMediaQuery('(max-width: 1530px)');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const companyLogo = selectedCompany?.companyLogo;
  const companyName = selectedCompany?.label;

  const togglePasswordType = () => {
    setPasswordType((prevType) =>
      prevType === 'password' ? 'text' : 'password'
    );
  };

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    mode: 'all',
    defaultValues: {
      name: 'afriza',
      password: '1234567',
      company_id: '',
    },
  });

  const onSubmit = (data: {
    name: string;
    password: string;
    company_id: string;
  }) => {
    startTransition(async () => {
      try {
        const response = await signIn(
          data.name,
          data.password,
          data.company_id.toLocaleUpperCase()
        );
        if (response.ok) {
          toast.success('Login Successful');
          window.location.assign('/dashboard');
          form.reset();
        } else if (response.error) {
          toast.error(response.error);
        }
      } catch (error) {
        console.error('Error during signIn:', error); // Debugging log
        toast.error('An error occurred during login.');
      }
    });
  };

  return (
    <CardWrapper
      headerLabel='Login'
      backButtonLabel=''
      // backButtonLabel="Don't have an account ?"
      backButtonHref='/auth/register'
      companyLogo={companyLogo}
      companyName={companyName}
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
                  <FormLabel className='text-sm'>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='Please enter your user name'
                      className='border-gray-300 dark:border-gray-600 
                                 bg-white dark:bg-gray-800 
                                 text-gray-900 dark:text-gray-100 w-full'
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
            <FormField
              control={form.control}
              name='company_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Company</FormLabel>
                  <FormControl>
                    <CompanyCombobox
                      disabled={isPending}
                      value={field.value}
                      onChange={field.onChange}
                      onSelect={(company) => setSelectedCompany(company)} // Simpan data perusahaan yang dipilih
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            type='submit'
            className='w-full bg-blue-700 hover:bg-blue-600 
                       text-white dark:bg-blue-600 dark:hover:bg-blue-700'
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LogInForm;
