'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { auth, loading, checkAdminRole } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!auth || !checkAdminRole()) {
        if (window.location.pathname !== '/login') {
          toast.error('Bạn không có quyền truy cập. Vui lòng đăng nhập với tài khoản admin.', {
            duration: 5000,
            style: {
              backgroundColor: '#fef2f2',
              borderColor: '#f87171',
              borderWidth: '2px',
              color: '#dc2626',
            },
            icon: '🔒',
          });
          router.replace('/login?error=unauthorized');
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
