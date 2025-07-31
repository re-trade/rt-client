'use client';

import { IconAlertTriangle, IconHome, IconMail, IconRefresh } from '@tabler/icons-react';
import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="relative">
                <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent opacity-20 select-none">
                  ERROR
                </h1>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-6 bg-white rounded-2xl shadow-lg border border-red-200 animate-pulse">
                    <IconAlertTriangle size={48} className="text-red-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Lỗi nghiêm trọng</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Ứng dụng đã gặp lỗi nghiêm trọng. Vui lòng thử tải lại trang hoặc liên hệ hỗ trợ.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <summary className="cursor-pointer font-medium text-red-800 mb-2">
                    Chi tiết lỗi (Development)
                  </summary>
                  <pre className="text-xs text-red-700 overflow-auto">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                    {error.stack && `\nStack: ${error.stack}`}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={reset}
                className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <IconRefresh size={20} />
                Tải lại ứng dụng
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="flex items-center gap-3 bg-white hover:bg-orange-50 text-gray-800 border border-orange-200 hover:border-orange-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <IconHome size={20} className="text-orange-500" />
                Về trang chủ
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-red-200 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <IconMail size={20} className="text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Liên hệ khẩn cấp</h3>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Nếu lỗi vẫn tiếp tục, vui lòng liên hệ ngay với đội hỗ trợ:
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-600">Email khẩn cấp:</span>
                  <a
                    href="mailto:emergency@retrade.vn"
                    className="text-red-600 hover:text-red-700 hover:underline transition-colors font-medium"
                  >
                    emergency@retrade.vn
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-600">Hotline 24/7:</span>
                  <a
                    href="tel:19001234"
                    className="text-red-600 hover:text-red-700 hover:underline transition-colors font-medium"
                  >
                    1900 1234
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Mã lỗi:</strong> {error.digest || 'CRITICAL_ERROR'}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Thời gian: {new Date().toLocaleString('vi-VN')}
              </p>
              <p className="text-xs text-red-600">
                User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-orange-200">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ReTrade
              </div>
              <p className="text-gray-500 text-sm mt-2">Nền tảng thương mại điện tử hàng đầu</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
