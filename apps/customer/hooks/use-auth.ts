'use client';
import {
  accountMe,
  callLogout,
  loginInternal,
  TAccountMeResponse,
  TLocalLogin,
} from '@/services/auth.api';
import { ETokenName } from '@retrade/util';
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
    localStorage.removeItem(ETokenName.ACCESS_TOKEN);
    await callLogout();
    window.location.href = '/';
  }, []);

  const login = useCallback(
    async (data: TLocalLogin) => {
      try {
        await loginInternal(data);
        await isAuth();
      } catch {}
    },
    [isAuth],
  );
  return {
    logout,
    login,
    roles,
    isAuth,
    auth,
    account,
  };
}

export { useAuth };
