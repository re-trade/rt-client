'use client';
import { accountMe, TAccountMeResponse } from '@/services/auth.api';
import { useCallback, useEffect, useState } from 'react';
function useAuth() {
  const [auth, setIsAuth] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [account, setAccount] = useState<TAccountMeResponse>();
  const isAuth = useCallback(async () => {
    try {
      const response = await accountMe();
      if (!response) {
        throw new Error('No response');
      }
      setRoles(response.roles);
      setAccount(response);
      setIsAuth(true);
    } catch {
      setIsAuth(false);
    }
  }, []);
  useEffect(() => {
    isAuth();
  }, [isAuth]);
  const logout = useCallback(async () => {
    localStorage.removeItem('user');
    window.location.reload();
  }, []);
  return {
    logout,
    roles,
    isAuth,
    auth,
    account,
  };
}

export { useAuth };
