'use client';

import { ToastMessage, ToastType } from '@/hooks/use-toast';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Check, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastProps = {
  messages: ToastMessage[];
  closable?: boolean;
};

export default function Toast({ messages, closable = true }: ToastProps) {
  const [visibleMessages, setVisibleMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const newMessages = messages.filter(
      (msg) => !visibleMessages.some((visMsg) => visMsg.id === msg.id),
    );

    if (newMessages.length > 0) {
      newMessages.forEach((msg, index) => {
        setTimeout(() => {
          setVisibleMessages((prev) => [...prev, msg]);
        }, index * 100);
      });
    }
    const timers: NodeJS.Timeout[] = [];

    newMessages.forEach((msg) => {
      const timer = setTimeout(() => {
        handleClose(msg.id);
      }, 5000);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [messages]);

  const handleClose = (id: string) => {
    setVisibleMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

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
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Check size={16} className="text-white" />
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <AlertCircle size={16} className="text-white" />
          </motion.div>
        );
      case 'warning':
        return (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <AlertTriangle size={16} className="text-white" />
          </motion.div>
        );
      case 'info':
      default:
        return (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Info size={16} className="text-white" />
          </motion.div>
        );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[9999]">
      <AnimatePresence mode="popLayout">
        {visibleMessages.map((msg) => {
          const styles = getStyles(msg.type);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, rotateZ: 5, scale: 0.8 }}
              layout
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                duration: 0.4,
                layout: { type: 'spring', damping: 30 },
              }}
              className={clsx('px-5 py-4 rounded-lg shadow-lg border', styles.containerClass)}
              style={{
                minWidth: '300px',
                maxWidth: '400px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transformOrigin: 'center right',
              }}
            >
              <div className="flex items-center gap-3">
                {getIcon(msg.type)}
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm"
                >
                  {msg.text}
                </motion.span>
                {closable && (
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleClose(msg.id)}
                    className="hover:text-orange-600 transition-colors duration-200 flex-shrink-0 ml-auto"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
