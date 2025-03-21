import '@/app/globals.css';
import '@/app/theme.css';
import { Inter } from 'next/font/google';
import Providers from '@/provider/providers';
import 'simplebar-react/dist/simplebar.min.css';
import TanstackProvider from '@/provider/providers.client';
import { AuthProvider } from '@/provider/auth.provider';
import 'flatpickr/dist/themes/light.css';
import DirectionProvider from '@/provider/direction.provider';
import ModalProvider from '@/provider/modal-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  // params: { lang },
}: {
  children: React.ReactNode;
  // params: { lang: string };
}) {
  return (
    <html className={inter.className} suppressHydrationWarning>
      {/* <body className={inter.className}> */}
      <AuthProvider>
        <TanstackProvider>
          <Providers>
            <DirectionProvider>
              {/* <ModalProvider /> */}

              {children}
            </DirectionProvider>
          </Providers>
        </TanstackProvider>
      </AuthProvider>
      {/* </body> */}
    </html>
  );
}
