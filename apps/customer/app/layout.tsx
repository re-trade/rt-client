import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { Suspense } from 'react';
import './globals.css';
const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className="bg-white">
        <Suspense>
          <Header />
        </Suspense>
        <div className="min-h-screen bg-gray-100">
          <Suspense>{children}</Suspense>
        </div>
        <Footer />
      </body>
    </html>
  );
};
export default RootLayout;
