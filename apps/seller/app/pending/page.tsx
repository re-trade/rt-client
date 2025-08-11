'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PendingPage() {
  const { auth, handleLogout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth === false) {
      router.push('/login');
    }
  }, [auth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">Đang chờ xét duyệt</h1>
          <p className="text-gray-600">
            Đăng ký của bạn đang được xem xét. Vui lòng kiểm tra lại sau. Quá trình này có thể mất
            từ 1-3 ngày làm việc.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Bạn sẽ nhận được thông báo khi tài khoản được duyệt.
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
