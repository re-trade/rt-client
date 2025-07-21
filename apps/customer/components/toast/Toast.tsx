'use client';

import { ToastMessage, ToastType } from '@/hooks/use-toast';
import clsx from 'clsx';
import { AlertCircle, AlertTriangle, Check, Info, X } from 'lucide-react';
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

  const getStyles = (type: ToastType): { containerClass: string; iconBg: string } => {
    switch (type) {
      case 'success':
        return {
          containerClass: 'bg-gradient-to-r from-white to-green-50 border-green-200 text-gray-700',
          iconBg: 'bg-green-500',
        };
      case 'error':
        return {
          containerClass: 'bg-gradient-to-r from-white to-red-50 border-red-200 text-gray-700',
          iconBg: 'bg-red-500',
        };
      case 'warning':
        return {
          containerClass:
            'bg-gradient-to-r from-white to-yellow-50 border-yellow-200 text-gray-700',
          iconBg: 'bg-yellow-500',
        };
      case 'info':
      default:
        return {
          containerClass:
            'bg-gradient-to-r from-white to-orange-50 border-orange-200 text-gray-700',
          iconBg: 'bg-orange-500',
        };
    }
  };

  const getIcon = (type: ToastType) => {
    const styles = getStyles(type);
    switch (type) {
      case 'success':
        return (
          <div
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Check size={16} className="text-white" />
          </div>
        );
      case 'error':
        return (
          <div
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <AlertCircle size={16} className="text-white" />
          </div>
        );
      case 'warning':
        return (
          <div
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <AlertTriangle size={16} className="text-white" />
          </div>
        );
      case 'info':
      default:
        return (
          <div
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Info size={16} className="text-white" />
          </div>
        );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {messages.map((msg) => {
        const styles = getStyles(msg.type);
        return (
          <div
            key={msg.id}
            className={clsx(
              'px-5 py-4 rounded-lg shadow-md transition-all duration-300 transform border',
              styles.containerClass,
              visibleIds.includes(msg.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            )}
            style={{ minWidth: '300px', maxWidth: '400px' }}
          >
            <div className="flex items-center gap-3">
              {getIcon(msg.type)}
              <span className="text-sm">{msg.text}</span>
              {closable && (
                <button
                  onClick={() => setVisibleIds((prev) => prev.filter((id) => id !== msg.id))}
                  className="hover:text-orange-600 transition-colors duration-200 flex-shrink-0 ml-auto"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
