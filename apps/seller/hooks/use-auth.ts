'use client';
import {
  accountMe,
  loginInternal,
  logout,
  TAccountMeResponse,
  TLocalLogin,
} from '@/service/auth.api';
import { ETokenName } from '@retrade/util';
import { useCallback, useEffect, useState } from 'react';

function useAuth() {
  const [auth, setIsAuth] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [account, setAccount] = useState<TAccountMeResponse>();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem(ETokenName.ACCESS_TOKEN);
      if (token) {
        setIsAuth(true);
        const response = await accountMe();
        if (!response) {
          localStorage.removeItem(ETokenName.ACCESS_TOKEN);
          setIsAuth(false);
        }
        return;
      }
      const response = await accountMe();
      if (!response) {
        setIsAuth(false);
        return;
      }

      setRoles(response.roles);
      setAccount(response);
      setIsAuth(true);
    } catch {
      localStorage.removeItem(ETokenName.ACCESS_TOKEN);
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = useCallback(async () => {
    localStorage.clear();
    await logout();
    window.location.reload();
  }, []);

  const login = useCallback(
    async (data: TLocalLogin) => {
      try {
        await loginInternal(data);
        await checkAuth();
      } catch (error) {
        throw error;
      }
    },
    [checkAuth],
  );

  return {
    handleLogout,
    login,
    roles,
    checkAuth,
    auth,
    account,
    isLoading: auth === null,
  };
}

export { useAuth };
export type { TAccountMeResponse };
