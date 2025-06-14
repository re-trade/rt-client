'use client';
import { accountMe } from '@/services/auth.api';
import { useCallback, useEffect, useState } from 'react';
function useAuth() {
  const [auth, setIsAuth] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const isAuth = useCallback(async () => {
    try {
      const response = await accountMe();
      if (!response) {
        throw new Error('No response');
      }
      setRoles(response.roles);
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
  };
}

export { useAuth };
