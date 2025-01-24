import { Suspense } from "react";
import './globals.css';
import HeaderNavbar from "@/components/common/Header";
const RootLayout = ({children}:Readonly<{children: React.ReactNode}>) => {
    return (
        <html lang='en'>
          <body>
            <Suspense>
              <HeaderNavbar/>
            </Suspense>
            <div className='min-h-screen bg-gray-100'>
              <Suspense>{children}</Suspense>
            </div>
          </body>
        </html>
      );
}
export default RootLayout;