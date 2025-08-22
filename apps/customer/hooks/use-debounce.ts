'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook for debouncing values with configurable delay
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing callbacks with configurable delay
 * @param callback - The callback function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @param dependencies - Dependencies array for the callback
 * @returns Object with cancel function to cancel pending debounced calls
 */
export function useDebouncedCallback(
  callback: () => void,
  delay: number = 300,
  dependencies: React.DependencyList = [],
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...dependencies, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { cancel };
}
