import '@/app/globals.css';
import '@/app/theme.css';
import { Inter } from 'next/font/google';
import 'simplebar-react/dist/simplebar.min.css';
import TanstackProvider from '@/provider/providers.client';
import { AuthProvider } from '@/provider/auth.provider';
import 'flatpickr/dist/themes/light.css';
import DirectionProvider from '@/provider/direction.provider';
import Providers from '@/provider/providers';
// import ModalProvider from '@/provider/modal-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {/* <body className="easyApp" suppressHydrationWarning>{children}</body> */}

        <AuthProvider>
          <TanstackProvider>
            <Providers>
              {/* <ModalProvider /> */}
              {children}
            </Providers>
          </TanstackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
