'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  opened: boolean;
  onClose: () => void;
  className?: string;
  title?: string;
  showHeader?: boolean;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  closeOnClickOutside?: boolean;
  children: React.ReactNode;
}

/**
 * A simple reusable modal component.
 *
 * @component
 * @example
 * ```tsx
 * <Modal
 *   opened={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Example Modal"
 * >
 *   <p>Modal content goes here</p>
 * </Modal>
 * ```
 */
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      opened,
      onClose,
      className = '',
      children,
      title,
      showHeader = true,
      showCloseButton = true,
      size = 'md',
      closeOnClickOutside = true,
      ...props
    },
    ref,
  ) => {
    const [mounted, setMounted] = React.useState(false);

    const closeOnEscape = React.useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      },
      [onClose],
    );

    // Helper function to get size-specific classes
    const getSizeClasses = (modalSize: ModalProps['size']) => {
      switch (modalSize) {
        case 'sm':
          return 'w-full max-w-sm';
        case 'lg':
          return 'w-full max-w-4xl';
        case 'xl':
          return 'w-full max-w-6xl';
        case 'fullscreen':
          return 'w-full h-screen rounded-none';
        case 'md':
        default:
          return 'w-full max-w-2xl';
      }
    };

    React.useEffect(() => {
      setMounted(true);

      if (opened) {
        document.body.classList.add('overflow-hidden');
        document.addEventListener('keydown', closeOnEscape);
      } else {
        document.body.classList.remove('overflow-hidden');
        document.removeEventListener('keydown', closeOnEscape);
      }

      return () => {
        document.body.classList.remove('overflow-hidden');
        document.removeEventListener('keydown', closeOnEscape);
      };
    }, [opened, closeOnEscape]);

    const modalContent = (
      <AnimatePresence>
        {opened && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 bg-opacity-50 backdrop-blur-sm"
            onClick={() => {
              if (closeOnClickOutside) {
                onClose();
              }
            }}
          >
            <motion.div
              ref={ref}
              className={cn(
                'bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]',
                getSizeClasses(size),
                className,
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              {...(props as React.ComponentProps<typeof motion.div>)}
            >
              {/* Header Section */}
              {showHeader && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
                  {showCloseButton && (
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Body Section */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );

    if (!mounted) return null;

    return createPortal(modalContent, document.body);
  },
);

Modal.displayName = 'Modal';

export default Modal;
