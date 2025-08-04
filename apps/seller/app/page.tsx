'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SellerAuthMiddleware() {
  const { auth, roles, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    setIsRedirecting(true);
    if (auth === false) {
      router.push('/login');
    } else if (auth === true) {
      const hasSellerRole = roles.includes('ROLE_SELLER');

      if (hasSellerRole) {
        router.push('/dashboard');
      } else {
        router.push('/register');
      }
    }
  }, [auth, roles, isLoading, router]);

  if (isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            {isLoading ? 'Đang kiểm tra xác thực...' : 'Đang chuyển hướng...'}
          </p>
          <p className="text-gray-500 text-sm mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Đang xử lý...</p>
      </div>
    </div>
  );
}
