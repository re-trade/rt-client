'use client';

import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type ToastMessage = {
  id: string;
  type: ToastType;
  text: string;
};

function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const showToast = useCallback(
    (text: string, type: ToastType = 'info') => {
      const id = uuidv4();
      const newToast: ToastMessage = { id, text, type };
      setMessages((prev) => [...prev, newToast]);
      const timer = setTimeout(() => {
        removeToast(id);
      }, 4000);
      timersRef.current.set(id, timer);
    },
    [removeToast],
  );
  return {
    messages,
    showToast,
    removeToast,
  };
}

export { useToast };
