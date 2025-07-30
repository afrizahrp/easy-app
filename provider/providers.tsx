// providers.tsx
'use client';
import { Inter } from 'next/font/google';
import { useThemeStore } from '@/store';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { Toaster as ReactToaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { theme, radius } = useThemeStore();
  const location = usePathname();

  // Add null checks to prevent errors
  const safeTheme = theme || 'light';
  const safeRadius = radius || 0.5;

  return (
    <ThemeProvider attribute='class' enableSystem={false} defaultTheme='light'>
      <div
        className={cn(
          'h-full',
          inter.className,
          location !== '/' && `theme-${safeTheme}`
        )}
        style={{ '--radius': `${safeRadius}rem` } as React.CSSProperties}
      >
        {children}
        <ReactToaster />
      </div>
    </ThemeProvider>
  );
};

export default Providers;
