import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ToastProvider } from '@/context/ToastContext';
import { CookieConsent } from '@components/common/CookieConsent';
import Footer from '@components/common/Footer';
import Header from '@components/header/Header';
import { ReactNode, Suspense } from 'react';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3003'}
        />
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Suspense>
                <Header />
              </Suspense>
              <div className="min-h-screen bg-gray-100">
                <ToastProvider>
                  <Suspense>{children}</Suspense>
                </ToastProvider>
              </div>
              <Footer />
              <CookieConsent />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
