'use client';

import React, { ReactNode, useEffect } from 'react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  submitButton?: ReactNode;
  cancelButton?: ReactNode;
  isLoading?: boolean;
  status?: 'success' | 'error' | 'warning' | 'info' | null;
  statusMessage?: string;
}

const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  submitButton,
  cancelButton,
  isLoading = false,
  status = null,
  statusMessage,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Restore scroll when modal is closed
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full mx-4 relative animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            className="ml-auto text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            onClick={onClose}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {status && statusMessage && (
            <div
              className={`mb-6 p-4 rounded-md border flex items-start gap-2 ${
                status === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : status === 'error'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : status === 'warning'
                      ? 'bg-[#FFF8E6] border-[#FFE9AF] text-amber-700'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              {status === 'success' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {status === 'error' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {status === 'warning' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              {status === 'info' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <div>{statusMessage}</div>
            </div>
          )}

          <div
            className={`transition-all duration-300 ${isLoading ? 'opacity-60 pointer-events-none scale-[0.99]' : 'opacity-100 scale-100'}`}
          >
            {children}
          </div>

          {(submitButton || cancelButton) && (
            <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-6">
              {cancelButton}
              {submitButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;
