'use client';

import { ETokenName, IResponseObject, unAuthApi } from '@retrade/util';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

type TTokenResponse = {
  tokens: { ACCESS_TOKEN: string; REFRESH_TOKEN: string };
  roles: string[];
  twoFA: boolean;
};

export function useFastSocketAuth() {
  const router = useRouter();
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const getTokenFast = useCallback((): string | null => {
    return localStorage.getItem(ETokenName.ACCESS_TOKEN);
  }, []);

  const refreshTokenIfNeeded = useCallback(async (): Promise<string | null> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        const response = await unAuthApi.default.post<IResponseObject<TTokenResponse>>(
          '/auth/refresh-token',
          {},
          {
            withCredentials: true,
          },
        );

        if (response.data.success && response.data.content?.tokens?.ACCESS_TOKEN) {
          const newToken = response.data.content.tokens.ACCESS_TOKEN;
          localStorage.setItem(ETokenName.ACCESS_TOKEN, newToken);
          return newToken;
        } else {
          return null;
        }
      } catch (error) {
        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, []);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    let token = getTokenFast();
    if (token) {
      return token;
    }

    token = await refreshTokenIfNeeded();
    if (!token) {
      localStorage.removeItem(ETokenName.ACCESS_TOKEN);
      router.push('/login');
      return null;
    }

    return token;
  }, [getTokenFast, refreshTokenIfNeeded, router]);

  return {
    getTokenFast,
    getValidToken,
    refreshTokenIfNeeded,
  };
}
