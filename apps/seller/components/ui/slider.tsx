'use client';

import * as React from 'react';
// Retrade-themed slider component - custom implementation for price filtering
import { cn } from '@/lib/utils';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

const Slider = React.forwardRef<
  HTMLDivElement,
  SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof SliderProps>
>(
  (
    { className, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, ...props },
    ref,
  ) => {
    const [localValues, setLocalValues] = React.useState<number[]>(
      value || defaultValue || [min, max],
    );
    const [isDragging, setIsDragging] = React.useState<number | null>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Update local values when props change
    React.useEffect(() => {
      if (value) {
        setLocalValues(value);
      }
    }, [value]);

    const getPercentage = React.useCallback(
      (val: number) => {
        return ((val - min) / (max - min)) * 100;
      },
      [min, max],
    );

    // Calculate value from mouse position with step constraints
    const getValueFromPosition = React.useCallback(
      (position: number) => {
        if (!trackRef.current) return 0;
        const { left, width } = trackRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(100, ((position - left) / width) * 100));

        const rawValue = min + (percentage / 100) * (max - min);
        // Round to nearest step
        return Math.round(rawValue / step) * step;
      },
      [min, max, step],
    );

    const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(index);
    };

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (isDragging === null || !trackRef.current) return;

        const newValue = getValueFromPosition(e.clientX);

        setLocalValues((prev) => {
          const newValues = [...prev];

          // Ensure the thumb doesn't cross over adjacent thumbs
          if (isDragging === 0 && prev[1] !== undefined) {
            newValues[isDragging] = Math.min(newValue, prev[1] - step);
          } else if (isDragging === 1 && prev[0] !== undefined) {
            newValues[isDragging] = Math.max(newValue, prev[0] + step);
          } else {
            newValues[isDragging] = newValue;
          }

          return newValues;
        });
      },
      [isDragging, getValueFromPosition, step],
    );

    const handleMouseUp = React.useCallback(() => {
      if (isDragging !== null && onValueChange) {
        onValueChange(localValues);
      }
      setIsDragging(null);
    }, [isDragging, localValues, onValueChange]);

    // Add event listeners for mouse move and up
    React.useEffect(() => {
      if (isDragging !== null) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Calculate positions for rendering
    const startPercentage = getPercentage(localValues[0] || min);
    const endPercentage = getPercentage(localValues[1] || max);

    return (
      <div
        ref={ref}
        className={cn('relative w-full touch-none select-none py-2', className)}
        {...props}
      >
        <div ref={trackRef} className="relative h-2 w-full rounded-full bg-slate-200">
          {/* Active track */}
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
            }}
          />

          {/* Thumbs */}
          {localValues.map((_, index) => (
            <div
              key={index}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border border-orange-500 bg-white',
                'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400',
                'shadow-sm hover:shadow-md',
                isDragging === index ? 'ring-2 ring-orange-500 scale-110 shadow-md' : '',
                'cursor-grab active:cursor-grabbing',
              )}
              style={{ left: `${getPercentage(localValues[index] || (index === 0 ? min : max))}%` }}
              onMouseDown={handleMouseDown(index)}
              tabIndex={0}
              role="slider"
              aria-label={index === 0 ? 'Minimum price' : 'Maximum price'}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={localValues[index] || 0}
            />
          ))}
        </div>
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export { Slider };
