// app/layout.tsx
import '@/app/globals.scss';
import '@/app/theme.scss';
import { cn } from '@/lib/utils';

import { Inter } from 'next/font/google';
import 'simplebar-react/dist/simplebar.min.css';
import TanstackProvider from '@/provider/providers.client';
import { AuthProvider } from '@/provider/auth.provider';
import 'flatpickr/dist/themes/light.css';
import DirectionProvider from '@/provider/direction.provider';
import Providers from '@/provider/providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={cn('easyApp', inter.className)}>
        <AuthProvider>
          <TanstackProvider>
            <Providers>
              <DirectionProvider>{children}</DirectionProvider>
            </Providers>
          </TanstackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
