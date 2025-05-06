import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

interface HeaderProps {
  label: string;
  companyLogo?: string;
}

import Image from 'next/image';

export const Header: React.FC<HeaderProps> = ({
  label,
  companyLogo,
}: HeaderProps) => {
  return (
    <div className='w-full flex flex-col items-center justify-center mb-0 mt-0'>
      <Image
        src={companyLogo || '/images/logo/logo.png'}
        alt='logoAtlogin'
        style={{ top: 0, textAlign: 'left' }}
        width={100}
        height={100}
        priority
      />
      <h1
        className={cn(
          'text-md font-semibold text-primary-foreground dark:text-slate-200 drop-shadow-md -mt-2',
          font.className
        )}
      >
        {label}
      </h1>
    </div>
  );
};
