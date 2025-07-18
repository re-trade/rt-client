'use client';

import { useToast as useToastHook } from '@/hooks/use-toast';

import { createContext, ReactNode, useContext } from 'react';

type ToastContextType = ReturnType<typeof useToastHook>;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const cartData = useToastHook();

  return <ToastContext.Provider value={cartData}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a Toast Provider');
  }
  return context;
};
