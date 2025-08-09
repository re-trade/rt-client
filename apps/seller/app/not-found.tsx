'use client';

import { IconAlertTriangle, IconArrowLeft, IconHome, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent opacity-20 select-none">
              404
            </h1>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 bg-white rounded-2xl shadow-lg border border-orange-200 animate-bounce">
                <IconAlertTriangle size={48} className="text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Trang không tìm thấy</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <IconArrowLeft size={20} />
            Quay lại trang trước
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 bg-white hover:bg-orange-50 text-gray-800 border border-orange-200 hover:border-orange-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <IconHome size={20} className="text-orange-500" />
            Về Dashboard
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <IconSearch size={20} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Thử truy cập các trang phổ biến</h3>
          </div>

          <p className="text-gray-600 text-sm mb-4">
            Có thể bạn đang tìm kiếm một trong những trang này:
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              href="/dashboard"
              className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              • Dashboard
            </Link>
            <Link
              href="/dashboard/products"
              className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              • Sản phẩm
            </Link>
            <Link
              href="/dashboard/orders"
              className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              • Đơn hàng
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-orange-600 hover:text-orange-700 hover:underline transition-colors"
            >
              • Cài đặt
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-orange-200">
          <Link
            href="/dashboard"
            className="inline-block text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            ReTrade Seller Center
          </Link>
          <p className="text-gray-500 text-sm mt-2">Nền tảng quản lý bán hàng hàng đầu</p>
        </div>
      </div>
    </div>
  );
}
