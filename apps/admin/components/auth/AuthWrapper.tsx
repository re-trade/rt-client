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
        router.replace('/login');
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

  // Nếu đã xác thực và là admin thì render children
  if (auth && checkAdminRole()) {
    return <>{children}</>;
  }

  // Nếu không, trả về null (vì useEffect sẽ redirect)
  return null;
};

export default AuthWrapper;
