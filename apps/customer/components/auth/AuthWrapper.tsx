'use client';

import { accountMe } from '@/services/auth.api';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
  condition?: () => boolean;
  redirectPath?: string;
}

const AuthWrapper = ({ children, condition, redirectPath }: AuthWrapperProps) => {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const checkCondition = async () => {
      if (condition) {
        setIsAllowed(condition());
      } else {
        const result = await accountMe();
        setIsAllowed(!!result);
      }
    };

    checkCondition();
  }, [condition]);

  useEffect(() => {
    if (!isAllowed && redirectPath) {
      router.push(redirectPath);
    }
  }, [isAllowed, redirectPath, router]);

  if (!isAllowed) {
    return <></>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
