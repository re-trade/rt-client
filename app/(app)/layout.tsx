import type { Metadata } from "next";
import { Suspense } from "react";

const RootLayout = ({children}:Readonly<{children: React.ReactNode}>) => {
    return (
        <html lang='en'>
          <body>
            <div className='min-h-screen bg-gray-100'>
              <Suspense>{children}</Suspense>
            </div>
          </body>
        </html>
      );
}
export default RootLayout;