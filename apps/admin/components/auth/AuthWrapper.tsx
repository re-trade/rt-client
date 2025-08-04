'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { auth, loading, checkAdminRole } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!auth || !checkAdminRole()) {
        if (window.location.pathname !== '/login') {
          router.replace('/login');
        }
      }
    }
  }, [auth, loading, checkAdminRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-600">Đang kiểm tra quyền truy cập...</span>
      </div>
    );
  }

  // Nếu đang ở trang login, luôn render children
  if (window.location.pathname === '/login') {
    return <>{children}</>;
  }

  // Nếu có auth và là admin, render children
  if (auth && checkAdminRole()) {
    return <>{children}</>;
  }

  // Nếu không có auth hoặc không phải admin, return null (sẽ redirect trong useEffect)
  return null;
};

export default AuthWrapper;
