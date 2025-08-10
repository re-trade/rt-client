'use client';

import Toast from '@/components/toast/Toast';
import { useToast as useToastHook } from '@/hooks/use-toast';
import { createContext, ReactNode, useContext } from 'react';

type ToastContextType = ReturnType<typeof useToastHook>;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toastHook = useToastHook();

  return (
    <ToastContext.Provider value={toastHook}>
      {children}
      <Toast messages={toastHook.messages} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a Toast Provider');
  }
  return context;
};
