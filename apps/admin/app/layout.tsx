import type { Metadata } from 'next';
import { Geist, Geist_Mono, Open_Sans } from 'next/font/google';
import './globals.css';
import AuthWrapper from '@/components/auth/AuthWrapper';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  subsets: ['vietnamese'],
  display: 'swap',
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for ReTrade',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${openSans.className} antialiased`}
    >
      <body className="font-sans antialiased">
        <AuthWrapper>
            {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
