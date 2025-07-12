'use client';

import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type ToastMessage = {
  id: string;
  type: ToastType;
  text: string;
};

function useToast(duration = 3000) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (text: string, type: ToastType = 'info') => {
      const id = uuidv4();
      const newToast: ToastMessage = { id, text, type };
      setMessages((prev) => [...prev, newToast]);

      setTimeout(() => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }, duration);
    },
    [duration],
  );

  const removeToast = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  return {
    messages,
    showToast,
    removeToast,
  };
}

export { useToast };
