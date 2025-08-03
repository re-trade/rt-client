'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  typingUser?: string | null;
  className?: string;
}

export function TypingIndicator({ isTyping, typingUser, className = '' }: TypingIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;

    if (isTyping) {
      setVisible(true);
      setShowIndicator(true);

      hideTimer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
    } else {
      setShowIndicator(false);
      hideTimer = setTimeout(() => setVisible(false), 300);
    }

    return () => clearTimeout(hideTimer);
  }, [isTyping]);

  if (!visible) return null;

  const displayName = typingUser || 'Người bán';

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`flex justify-start ${className}`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm max-w-md">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{displayName} đang nhập...</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Alternative typing indicator with pulsing dots
export function TypingIndicatorPulse({
  isTyping,
  typingUser,
  className = '',
}: TypingIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTyping) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  if (!visible) return null;

  const displayName = typingUser || 'Người bán';

  return (
    <AnimatePresence>
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`flex justify-start ${className}`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm max-w-md">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{displayName} đang nhập...</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Advanced typing indicator with wave animation
export function TypingIndicatorWave({
  isTyping,
  typingUser,
  className = '',
}: TypingIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTyping) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  if (!visible) return null;

  const displayName = typingUser || 'Người bán';

  return (
    <AnimatePresence>
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={`flex justify-start ${className}`}
        >
          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm max-w-md">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{displayName} đang nhập...</span>
              <div className="flex gap-1 items-end">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
