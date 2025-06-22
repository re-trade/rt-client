import { CookieConsent } from '@/components/common/CookieConsent';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { CartProvider } from '@/context/CartContext';
import { ReactNode, Suspense } from 'react';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Suspense>
            <Header />
          </Suspense>
          <div className="min-h-screen bg-gray-100">
            <Suspense>{children}</Suspense>
          </div>
          <Footer />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
};

export default RootLayout;
