'use client';

import { ETokenName, IResponseObject, unAuthApi } from '@retrade/util';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

type TTokenResponse = {
  tokens: { ACCESS_TOKEN: string; REFRESH_TOKEN: string };
  roles: string[];
  twoFA: boolean;
};

export function useSocketAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    // If already refreshing, return the existing promise
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    // Create new refresh promise
    refreshPromiseRef.current = (async () => {
      try {
        setIsRefreshing(true);
        console.log('Refreshing token for socket authentication...');

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
          setAccessToken(newToken);
          console.log('Token refreshed successfully for socket');
          return newToken;
        } else {
          console.error('Token refresh failed: Invalid response');
          return null;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
      } finally {
        setIsRefreshing(false);
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, []);

  const ensureValidToken = useCallback(async (): Promise<string | null> => {
    // Check if we already have a valid token
    let token = localStorage.getItem(ETokenName.ACCESS_TOKEN);

    if (token) {
      // Skip API validation for socket auth to avoid delays
      // The socket server will validate the token anyway
      setAccessToken(token);
      return token;
    }

    // If no token, try to refresh
    token = await refreshToken();
    if (!token) {
      // Refresh failed, redirect to login
      console.log('Token refresh failed, redirecting to login');
      localStorage.removeItem(ETokenName.ACCESS_TOKEN);
      setAccessToken(null);
      setIsAuthenticated(false);
      router.push('/login');
      return null;
    }

    setAccessToken(token);
    return token;
  }, [refreshToken, router]);

  const authenticateSocket = useCallback(async () => {
    const token = await ensureValidToken();
    if (token) {
      setIsAuthenticated(true);
      return token;
    }
    return null;
  }, [ensureValidToken]);

  const logout = useCallback(() => {
    localStorage.removeItem(ETokenName.ACCESS_TOKEN);
    setAccessToken(null);
    setIsAuthenticated(false);
    refreshPromiseRef.current = null;
  }, []);

  // Initialize authentication state
  useEffect(() => {
    const token = localStorage.getItem(ETokenName.ACCESS_TOKEN);
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return {
    isAuthenticated,
    isRefreshing,
    accessToken,
    authenticateSocket,
    ensureValidToken,
    refreshToken,
    logout,
  };
}
