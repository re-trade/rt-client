'use client';

import { accountMe, TAccountMeResponse } from '@/services/auth.api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

function useAuth(skipAutoCheck = false) {
  const [auth, setIsAuth] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [account, setAccount] = useState<TAccountMeResponse>();
  const [loading, setLoading] = useState(true);

  const isAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await accountMe();
      if (!response) {
        throw new Error('No response');
      }
      setRoles(response.roles);
      setAccount(response);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      setRoles([]);
      setAccount(undefined);

      // Check if token has expired or there was an auth error
      const isAuthError =
        error instanceof Error && (error.message.includes('401') || error.message.includes('403'));

      if (isAuthError && window.location.pathname !== '/login') {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
          duration: 5000,
          style: {
            backgroundColor: '#fff1f2',
            borderColor: '#fb7185',
            borderWidth: '2px',
            color: '#e11d48',
          },
          icon: '⚠️',
          action: {
            label: 'Đăng nhập',
            onClick: () => (window.location.href = '/login'),
          },
        });
        window.location.href = '/login?error=session-expired';
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!skipAutoCheck) {
      isAuth();
    }
  }, [isAuth, skipAutoCheck]);

  const logout = useCallback(async () => {
    // Remove from localStorage
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');

    // Remove from cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    setIsAuth(false);
    setRoles([]);
    setAccount(undefined);
    toast.success('Đăng xuất thành công!', {
      duration: 3000,
      style: {
        backgroundColor: '#f0fdfa',
        borderColor: '#2dd4bf',
        borderWidth: '2px',
        color: '#0f766e',
      },
      icon: '👋',
      action: {
        label: 'Đăng nhập lại',
        onClick: () => (window.location.href = '/login'),
      },
    });
    window.location.href = '/login';
  }, []);

  const checkAdminRole = useCallback(() => {
    return roles.includes('ROLE_ADMIN');
  }, [roles]);

  return {
    logout,
    roles,
    isAuth,
    auth,
    account,
    loading,
    checkAdminRole,
  };
}

export { useAuth };
export type { TAccountMeResponse };
