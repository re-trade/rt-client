'use client';

import { IconAlertCircle, IconHome, IconMail, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent opacity-20 select-none">
              500
            </h1>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 bg-white rounded-2xl shadow-lg border border-red-200 animate-pulse">
                <IconAlertCircle size={48} className="text-red-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Có lỗi xảy ra</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Xin lỗi, máy chủ đang gặp sự cố. Chúng tôi đang khắc phục vấn đề này.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <summary className="cursor-pointer font-medium text-red-800 mb-2">
                Chi tiết lỗi (Development)
              </summary>
              <pre className="text-xs text-red-700 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
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
            Thử lại
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 bg-white hover:bg-orange-50 text-gray-800 border border-orange-200 hover:border-orange-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <IconHome size={20} className="text-orange-500" />
            Về trang chủ
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <IconMail size={20} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Cần hỗ trợ?</h3>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với chúng tôi:
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-600">Email:</span>
              <a
                href="mailto:support@retrade.vn"
                className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
              >
                support@retrade.vn
              </a>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-600">Hotline:</span>
              <a
                href="tel:19001234"
                className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
              >
                1900 1234
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>Mã lỗi:</strong> {error.digest || 'INTERNAL_SERVER_ERROR'}
          </p>
          <p className="text-xs text-orange-600 mt-1">
            Thời gian: {new Date().toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-orange-200">
          <Link
            href="/"
            className="inline-block text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            ReTrade
          </Link>
          <p className="text-gray-500 text-sm mt-2">Nền tảng thương mại điện tử hàng đầu</p>
        </div>
      </div>
    </div>
  );
}
