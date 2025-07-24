'use client';
import { accountMe, loginInternal, TAccountMeResponse, TLocalLogin } from '@/service/auth.api';
import { ETokenName } from '@retrade/util';
import { useCallback, useEffect, useState } from 'react';

function useAuth() {
  const [auth, setIsAuth] = useState<boolean | null>(null); // null = loading, false = not auth, true = auth
  const [roles, setRoles] = useState<string[]>([]);
  const [account, setAccount] = useState<TAccountMeResponse>();

  const checkAuth = useCallback(async () => {
    try {
      // Check if token exists in localStorage first
      const token = localStorage.getItem(ETokenName.ACCESS_TOKEN);
      if (!token) {
        setIsAuth(false);
        return;
      }

      const response = await accountMe();
      if (!response) {
        // Token exists but invalid, remove it
        localStorage.removeItem(ETokenName.ACCESS_TOKEN);
        setIsAuth(false);
        return;
      }

      setRoles(response.roles);
      setAccount(response);
      setIsAuth(true);
    } catch (error) {
      // Token exists but request failed, remove it
      localStorage.removeItem(ETokenName.ACCESS_TOKEN);
      setIsAuth(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    localStorage.removeItem(ETokenName.ACCESS_TOKEN);
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
    logout,
    login,
    roles,
    checkAuth,
    auth,
    account,
    isLoading: auth === null, // Add loading state
  };
}

export { useAuth };
export type { TAccountMeResponse };
