'use client';

import { accountMe, TAccountMeResponse } from '@/services/auth.api';
import { useCallback, useEffect, useState } from 'react';

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
    } catch {
      setIsAuth(false);
      setRoles([]);
      setAccount(undefined);
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
