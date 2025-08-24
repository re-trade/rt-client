'use client';

import { IResponseObject } from '@retrade/util';
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

  const showToastFromResponse = useCallback(
    <T>(
      response: IResponseObject<T>,
      type: 'success' | 'error' | 'info' = 'info',
      fallbackMessage?: string,
    ) => {
      // If response has messages array, show each message
      if (response.messages && response.messages.length > 0) {
        response.messages.forEach((msg, index) => {
          // Add a small delay between multiple messages to avoid overlap
          setTimeout(() => {
            switch (type) {
              case 'success':
                toast.success(msg);
                break;
              case 'error':
                toast.error(msg);
                break;
              case 'info':
              default:
                toast.info(msg);
                break;
            }
          }, index * 100); // 100ms delay between messages
        });
      } else if (response.message) {
        // Fallback to single message field
        switch (type) {
          case 'success':
            toast.success(response.message);
            break;
          case 'error':
            toast.error(response.message);
            break;
          case 'info':
          default:
            toast.info(response.message);
            break;
        }
      } else if (fallbackMessage) {
        // Use provided fallback message
        switch (type) {
          case 'success':
            toast.success(fallbackMessage);
            break;
          case 'error':
            toast.error(fallbackMessage);
            break;
          case 'info':
          default:
            toast.info(fallbackMessage);
            break;
        }
      }
    },
    [],
  );

  const showMultipleToasts = useCallback(
    (messages: string[], type: 'success' | 'error' | 'info' = 'info') => {
      messages.forEach((message, index) => {
        setTimeout(() => {
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
        }, index * 100); // 100ms delay between messages
      });
    },
    [],
  );

  return {
    showToast,
    showToastFromResponse,
    showMultipleToasts,
  };
}
