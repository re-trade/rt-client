'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BanPage() {
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
          <div className="w-16 h-16 mx-auto mb-4 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">Tài khoản đã bị chặn</h1>
          <p className="text-gray-600">
            Tài khoản của bạn đã bị chặn khỏi nền tảng. Vui lòng liên hệ với bộ phận hỗ trợ để biết
            thêm thông tin.
          </p>

          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
