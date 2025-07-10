'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Header } from '@/components/auth/header';
import { BackButton } from '@/components/auth/back-button';
import { Social } from '@/components/auth/social'; // Import the Social component
import { useCompanyInfo } from '@/store';
import { useEffect } from 'react';

interface CardWrapperProps {
  children: React.ReactNode;
  backButtonLabel: string;
  backButtonHref: string;
  headerLabel: string;
  showSocial?: boolean;
  companyLogo?: string;
  companyName?: string;
}

export const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  headerLabel,
  showSocial = false, // Default to false if not provided
  companyLogo,
  companyName,
}: CardWrapperProps) => {
  const { setCompany } = useCompanyInfo((state) => ({
    setCompany: state.setCompany,
  }));

  useEffect(() => {
    if (companyName || companyLogo) {
      setCompany({
        companyName: companyName || '',
        companyLogo: companyLogo || '',
      });
    }
  }, [companyName, companyLogo, setCompany]);

  const { company } = useCompanyInfo((state) => ({
    company: state.company,
  }));

  const { companyName: storedCompanyName, companyLogo: storedCompanyLogo } =
    company || {};

  return (
    <Card className='w-[400px] shadow-md'>
      <CardHeader>
        <Header
          label={storedCompanyName || 'PT. BUMI INDAH SARANAMEDIS'}
          companyLogo={storedCompanyLogo}
        />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardContent>
          <Social />
        </CardContent>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
