'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  loading?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  emptyMessage = 'No results found.',
  searchPlaceholder = 'Search...',
  disabled = false,
  className,
  error = false,
  loading = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && highlightedIndex >= 0) {
      const items = listRef.current?.querySelectorAll('[role="option"]');
      if (items && items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, open]);

  const selectedOption = options.find((option) => option.value === value);

  function normalize(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .trim();
  }

  const filteredOptions = options.filter((option) => {
    if (!searchQuery) return true;
    const label = option.label || '';
    const query = searchQuery || '';
    return normalize(label).includes(normalize(query));
  });

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length &&
          filteredOptions[highlightedIndex]?.value
        ) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else if (filteredOptions.length === 1 && filteredOptions[0]?.value) {
          handleSelect(filteredOptions[0].value);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;

    try {
      const searchTerm = query.toLowerCase();
      const textLower = text.toLowerCase();
      const index = textLower.indexOf(searchTerm);

      if (index === -1) return text;

      return (
        <>
          {text.substring(0, index)}
          <span className="bg-yellow-200 font-medium">
            {text.substring(index, index + searchTerm.length)}
          </span>
          {text.substring(index + searchTerm.length)}
        </>
      );
    } catch (e) {
      return text;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between h-12',
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-orange-200 focus:border-orange-400',
            selectedOption ? 'text-foreground' : 'text-muted-foreground',
            className,
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <div className="flex">
            {selectedOption && (
              <X className="h-4 w-4 opacity-50 hover:opacity-100 mr-1" onClick={handleClear} />
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px]"
        align="start"
        onKeyDown={handleKeyDown}
      >
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <svg
              className="animate-spin h-4 w-4 text-orange-500 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Đang tải...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center border-b px-3">
              <input
                ref={inputRef}
                placeholder={searchPlaceholder}
                className="h-9 w-full flex-1 bg-transparent focus:outline-none placeholder:text-muted-foreground border-none py-2 px-0"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(-1);
                }}
                autoFocus
              />
              <Search className="h-4 w-4 opacity-50" />
            </div>

            {filteredOptions.length > 0 && (
              <div className="px-2 py-2 text-sm text-orange-700 flex items-center justify-center border-b bg-orange-50">
                <span className="inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1.5"
                  >
                    <polygon points="13 19 22 12 13 5 13 19"></polygon>
                    <polygon points="2 19 11 12 2 5 2 19"></polygon>
                  </svg>
                  Dùng ↑↓ để di chuyển, Enter để chọn
                </span>
              </div>
            )}

            <div ref={listRef} className="max-h-[228px] overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={cn(
                      'flex items-center justify-between py-2 px-2 cursor-pointer transition-all duration-200',
                      highlightedIndex === index
                        ? 'bg-orange-100 border-l-4 border-orange-500 font-medium shadow-sm pl-2'
                        : 'hover:bg-accent border-l-4 border-transparent',
                    )}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={highlightedIndex === index}
                  >
                    <span
                      className={cn(
                        'text-wrap break-words relative',
                        highlightedIndex === index ? 'text-orange-800' : '',
                      )}
                    >
                      {highlightedIndex === index && (
                        <span className="absolute -left-4 text-orange-600 font-bold">▶</span>
                      )}
                      {highlightMatch(option.label, searchQuery)}
                    </span>
                    {option.value === value && <Check className="h-4 w-4" />}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
