import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
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
      <body>
        <AuthProvider>
          <CartProvider>
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
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
