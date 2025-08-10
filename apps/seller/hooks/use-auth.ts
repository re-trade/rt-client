'use client';
import {
  accountMe,
  loginInternal,
  logout,
  TAccountMeResponse,
  TLocalLogin,
} from '@/service/auth.api';
import { sellerApi, SellerStatusResponse } from '@/service/seller.api';
import { ETokenName } from '@retrade/util';
import { useCallback, useEffect, useState } from 'react';

function useAuth() {
  const [auth, setIsAuth] = useState<boolean | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [account, setAccount] = useState<TAccountMeResponse>();
  const [sellerStatus, setSellerStatus] = useState<SellerStatusResponse>();

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

  const fetchCheckSellerStatus = useCallback(async () => {
    const response = await sellerApi.checkSellerStatus();
    if (response) {
      setSellerStatus(response);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchCheckSellerStatus();
  }, [checkAuth, fetchCheckSellerStatus]);

  const handleLogout = useCallback(async () => {
    localStorage.clear();
    await logout();
    window.location.href = '/';
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
    sellerStatus,
    roles,
    checkAuth,
    auth,
    account,
    isLoading: auth === null,
  };
}

export { useAuth };
export type { TAccountMeResponse };
