// import '../scss/globals.scss';
// import '../scss/theme.scss';
import '@/app/[lang]/globals.css'; // ✅ Impor dengan relative path
import '@/app/[lang]/theme.css';
import { Inter } from 'next/font/google';
import { siteConfig } from '@/config/site';
import Providers from '@/provider/providers';
import 'simplebar-react/dist/simplebar.min.css';
import TanstackProvider from '@/provider/providers.client';
import { AuthProvider } from '@/provider/auth.provider';
import 'flatpickr/dist/themes/light.css';
import DirectionProvider from '@/provider/direction.provider';
import ModalProvider from '@/provider/modal-provider';
// import './global.css';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
// };

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang}>
      <AuthProvider>
        <TanstackProvider>
          <Providers>
            <DirectionProvider lang={lang}>
              {/* <ModalProvider /> */}

              {children}
            </DirectionProvider>
          </Providers>
        </TanstackProvider>
      </AuthProvider>
    </html>
  );
}
