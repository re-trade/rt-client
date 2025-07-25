'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

export function useToast() {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
      default:
        toast.info(message);
        break;
    }
  }, []);

  return { showToast };
}
