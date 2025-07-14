'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
  condition?: () => boolean;
  redirectPath?: string;
}

const AuthWrapper = ({ children, condition, redirectPath = '/login' }: AuthWrapperProps) => {
  const router = useRouter();
  const { auth, loading, checkAdminRole } = useAuth();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const checkCondition = async () => {
      if (loading) return; // Wait for auth check to complete

      if (condition) {
        setIsAllowed(condition());
      } else {
        // Default condition: must be authenticated and have admin role
        const isAdmin = checkAdminRole();
        setIsAllowed(auth && isAdmin);
      }
    };

    checkCondition();
  }, [auth, loading, checkAdminRole, condition]);

  useEffect(() => {
    if (!loading && !isAllowed && redirectPath) {
      router.push(redirectPath);
    }
  }, [isAllowed, redirectPath, router, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang kiểm tra quyền truy cập...</span>
        </div>
      </div>
    );
  }

  // Don't render anything if not allowed (will redirect)
  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
