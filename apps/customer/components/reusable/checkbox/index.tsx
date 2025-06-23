'use client';

import { cn } from '@/lib/utils';
import { IconCheck, IconMinus } from '@tabler/icons-react';
import React, { forwardRef } from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'size'> {
  checked?: boolean;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary' | 'danger';
  label?: string;
  labelPosition?: 'left' | 'right';
  className?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  round?: boolean; // New prop for round checkboxes
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked = false,
      indeterminate = false,
      onChange,
      size = 'md',
      variant = 'primary',
      disabled = false,
      label,
      labelPosition = 'right',
      className = '',
      checkboxClassName = '',
      labelClassName = '',
      round = false,
      ...props
    },
    ref,
  ) => {
    // Create a new ref if one is not provided
    const innerRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref || innerRef) as React.RefObject<HTMLInputElement>;

    // Update the indeterminate property which is not a standard prop
    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    // Size variations
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Icon sizes
    const iconSizes = {
      sm: 12,
      md: 14,
      lg: 16,
    };

    // Unchecked state styling
    const uncheckedClasses = round
      ? 'border-2 border-orange-300 bg-white hover:border-orange-400 shadow-sm'
      : 'border-2 border-stone-400 dark:border-stone-600 bg-white dark:bg-stone-800';

    // Background and border when checked/indeterminate
    const checkedBgClasses = {
      default: round
        ? 'bg-gradient-to-br from-gray-500 to-gray-600 border-gray-600 shadow-md'
        : 'bg-stone-600 dark:bg-stone-400 border-stone-600 dark:border-stone-400',
      primary: round
        ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-600 shadow-md'
        : 'bg-earth-600 dark:bg-jaffa-400 border-earth-600 dark:border-jaffa-400',
      secondary: round
        ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 shadow-md'
        : 'bg-blue-600 dark:bg-blue-400 border-blue-600 dark:border-blue-400',
      danger: round
        ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-600 shadow-md'
        : 'bg-red-600 dark:bg-red-400 border-red-600 dark:border-red-400',
    };

    const containerOrder = labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row';
    const borderRadius = round ? 'rounded-full' : 'rounded';

    return (
      <label
        className={cn(
          `flex ${containerOrder} items-center gap-2 cursor-pointer group`,
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        <div className="relative">
          <input
            type="checkbox"
            ref={resolvedRef}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only" // Hide the input visually but keep it accessible
            {...props}
          />
          <div
            className={cn(
              `flex items-center justify-center transition-all duration-200 transform`,
              sizeClasses[size],
              borderRadius,
              checked || indeterminate
                ? `${checkedBgClasses[variant]} scale-105` // Slight scale effect when checked
                : `${uncheckedClasses} group-hover:scale-105`, // Hover effect when unchecked
              round &&
                'ring-0 focus-within:ring-2 focus-within:ring-orange-400 focus-within:ring-opacity-50',
              checkboxClassName,
            )}
            aria-hidden="true"
          >
            {indeterminate ? (
              <IconMinus size={iconSizes[size]} className="text-white drop-shadow-sm" stroke={3} />
            ) : checked ? (
              <IconCheck size={iconSizes[size]} className="text-white drop-shadow-sm" stroke={3} />
            ) : null}
          </div>

          {/* Subtle ring effect for round checkboxes */}
          {round && (checked || indeterminate) && (
            <div
              className={cn(
                'absolute inset-0 rounded-full border-2 border-orange-400 opacity-30 animate-ping',
                sizeClasses[size],
              )}
              style={{ animationDuration: '1s', animationIterationCount: 1 }}
            />
          )}
        </div>
        {label && (
          <span className={cn('select-none text-sm font-medium text-gray-700', labelClassName)}>
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
