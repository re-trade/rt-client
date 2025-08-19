'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1000,
  formatValue = (val) => `${val.toLocaleString('vi-VN')}đ`,
  className = '',
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef<number>(0);

  // Debounce the onChange callback to avoid excessive API calls
  // Only trigger onChange when not actively dragging
  const debouncedValue = useDebounce(localValue, isDragging ? 0 : 500);

  useEffect(() => {
    // Only call onChange if we're not currently dragging and the value has actually changed
    if (!isDragging && JSON.stringify(debouncedValue) !== JSON.stringify(value)) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value, isDragging]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getPercentage = useCallback(
    (val: number) => {
      return ((val - min) / (max - min)) * 100;
    },
    [min, max],
  );

  const getValueFromPercentage = useCallback(
    (percentage: number) => {
      const rawValue = min + (percentage / 100) * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step],
  );

  const handleMouseDown = useCallback(
    (type: 'min' | 'max') => (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(type);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      // Throttle updates during dragging to prevent excessive state changes
      const now = Date.now();
      if (now - lastUpdateRef.current < 16) return; // ~60fps
      lastUpdateRef.current = now;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const newValue = getValueFromPercentage(percentage);

      setLocalValue((prev) => {
        if (isDragging === 'min') {
          return [Math.min(newValue, prev[1]), prev[1]];
        } else {
          return [prev[0], Math.max(newValue, prev[0])];
        }
      });
    },
    [isDragging, getValueFromPercentage],
  );

  const handleMouseUp = useCallback(() => {
    const wasDragging = isDragging;
    setIsDragging(null);

    // Trigger onChange immediately when dragging stops to ensure final value is applied
    if (wasDragging) {
      setTimeout(() => {
        onChange(localValue);
      }, 100); // Small delay to ensure state is updated
    }
  }, [isDragging, localValue, onChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(localValue[0]);
  const maxPercentage = getPercentage(localValue[1]);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Value Display */}
      <div className="flex justify-between items-center text-sm font-medium text-gray-700">
        <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded">
          {formatValue(localValue[0])}
        </span>
        <span className="text-gray-400">–</span>
        <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded">
          {formatValue(localValue[1])}
        </span>
      </div>

      {/* Slider */}
      <div className="relative">
        <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer">
          {/* Active Range */}
          <div
            className="absolute h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />

          {/* Min Handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-150 hover:scale-110 ${
              isDragging === 'min' ? 'scale-110 shadow-lg cursor-grabbing' : 'hover:shadow-md'
            }`}
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown('min')}
          />

          {/* Max Handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-orange-500 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 transition-all duration-150 hover:scale-110 ${
              isDragging === 'max' ? 'scale-110 shadow-lg cursor-grabbing' : 'hover:shadow-md'
            }`}
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown('max')}
          />
        </div>

        {/* Range Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
}
