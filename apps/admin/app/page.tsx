'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { auth, loading, checkAdminRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Home page - auth:', auth, 'loading:', loading, 'checkAdminRole:', checkAdminRole());
    
    if (!loading) {
      if (auth && checkAdminRole()) {
        console.log('Redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log('Redirecting to login');
        router.push('/login');
      }
    }
  }, [auth, loading, checkAdminRole, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang kiểm tra quyền truy cập...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">Đang chuyển hướng...</span>
      </div>
    </div>
  );
}
