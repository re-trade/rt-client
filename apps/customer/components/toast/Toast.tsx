'use client';

import { ToastMessage, ToastType } from '@/hooks/use-toast';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastProps = {
  messages: ToastMessage[];
  closable?: boolean;
};

export default function Toast({ messages, closable = true }: ToastProps) {
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    messages.forEach((msg) => {
      if (!visibleIds.includes(msg.id)) {
        setVisibleIds((prev) => [...prev, msg.id]);

        const timer = setTimeout(() => {
          setVisibleIds((prev) => prev.filter((id) => id !== msg.id));
        }, 3000);

        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [messages, visibleIds]);

  const getStyles = (type: ToastType): string => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-500';
      case 'error':
        return 'bg-red-500 text-white border-red-500';
      case 'warning':
        return 'bg-yellow-400 text-black border-yellow-400';
      case 'info':
      default:
        return 'bg-blue-500 text-white border-blue-500';
    }
  };

  return (
    <div className="toast toast-end toast-bottom z-50">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={clsx(
            'alert shadow-lg transition-all duration-300 transform',
            getStyles(msg.type),
            visibleIds.includes(msg.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}
        >
          <span>{msg.text}</span>
          {closable && (
            <button
              onClick={() => setVisibleIds((prev) => prev.filter((id) => id !== msg.id))}
              className="hover:opacity-70"
            >
              <X size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
