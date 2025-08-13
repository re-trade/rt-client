'use client';
import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { getAllCategories } from '@/service/categories.api';
import { Command as CommandPrimitive } from 'cmdk';
import { RefreshCw, X, Check, Trash2, XCircle, Search, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

type Framework = Record<'value' | 'label', string>;

interface Props {
  onChange: (selected: string[]) => void;
  value?: string[];
  currentCategoryId?: {
    id: string;
    name: string;
  }[];
}

export function FancyMultiSelect({ onChange, value: initialValue = [], currentCategoryId }: Props) {
  const inputRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Framework[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [categories, setCategories] = React.useState<Framework[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Track if we've initialized to prevent multiple calls
  const hasInitialized = useRef(false);
  const lastNotifiedValues = useRef<string[]>([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await getAllCategories();
        const transformedCategories = categoriesData.map((category: any) => ({
          value: category.id || category.value,
          label: category.name || category.label,
        }));
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Memoize the initial selected values to prevent unnecessary re-calculations
  const initialSelectedValues = useMemo(() => {
    if (currentCategoryId && currentCategoryId.length > 0) {
      return currentCategoryId.map((item) => item.id);
    }
    return initialValue;
  }, [currentCategoryId, initialValue]);

  // Initialize selected items only once when categories are loaded
  useEffect(() => {
    if (categories.length === 0 || hasInitialized.current) return;

    const initialSelected = categories.filter((cat) => initialSelectedValues.includes(cat.value));

    setSelected(initialSelected);
    hasInitialized.current = true;

    // Set initial lastNotifiedValues to prevent immediate onChange call
    lastNotifiedValues.current = initialSelected.map((item) => item.value);
  }, [categories, initialSelectedValues]);

  // Helper function to check if arrays are equal
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

  // Notify parent of changes only when values actually change
  const notifyChange = useCallback(
    (newSelected: Framework[]) => {
      const newValues = newSelected.map((item) => item.value);

      if (!arraysEqual(newValues, lastNotifiedValues.current)) {
        lastNotifiedValues.current = newValues;
        onChange(newValues);
      }
    },
    [onChange],
  );

  const handleUnselect = useCallback(
    (framework: Framework) => {
      setSelected((prev) => {
        const newSelected = prev.filter((s) => s.value !== framework.value);
        setTimeout(() => notifyChange(newSelected), 0);
        return newSelected;
      });
    },
    [notifyChange],
  );

  const handleClearAll = useCallback(() => {
    setSelected([]);
    setTimeout(() => notifyChange([]), 0);
  }, [notifyChange]);

  const handleClose = useCallback(() => {
    setOpen(false);
    inputRef.current?.blur();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selected.length > 0) {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            setTimeout(() => notifyChange(newSelected), 0);
            return newSelected;
          });
        }
      }
    },
    [notifyChange, selected.length],
  );

  const handleSelect = useCallback(
    (framework: Framework) => {
      setSelected((prev) => {
        const isSelected = prev.some((s) => s.value === framework.value);
        let newSelected;
        if (isSelected) {
          // If already selected, remove it (unselect)
          newSelected = prev.filter((s) => s.value !== framework.value);
        } else {
          // If not selected, add it
          newSelected = [...prev, framework];
        }
        setTimeout(() => notifyChange(newSelected), 0);
        return newSelected;
      });
    },
    [notifyChange],
  );

  const handleInputFocus = useCallback(() => {
    setOpen(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setOpen(false), 200);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  // Filter categories based on search input
  const selectables = useMemo(() => {
    if (!inputValue) return categories;
    return categories.filter((framework) =>
      framework.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [categories, inputValue]);

  return (
    <div className="relative" ref={inputRef}>
      {loading ? (
        <div className="flex items-center justify-center py-8 border border-gray-300 rounded-lg bg-gray-50">
          <RefreshCw className="h-4 w-4 animate-spin mr-2 text-blue-600" />
          <span className="text-sm text-gray-600">Đang tải danh mục...</span>
        </div>
      ) : (
        <div>
          {/* Main selector box */}
          <div 
            className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer min-h-[40px]"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1 flex-1">
                {selected.length > 0 ? (
                  selected.map((framework) => (
                    <Badge key={framework.value} variant="secondary" className="text-xs">
                      {framework.label}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            handleUnselect(framework);
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(framework);
                        }}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">Chọn danh mục...</span>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Dropdown list */}
          {open && (
            <div className="absolute top-full mt-1 z-50 w-full rounded-md border bg-white shadow-lg">
              {/* Search header */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative flex items-center">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tìm kiếm danh mục..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Clear All button - only show when there are selected items */}
                {selected.length > 0 && (
                  <button
                    className="mt-2 w-full text-sm text-red-600 hover:text-red-700 flex items-center justify-center py-1 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearAll();
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Categories list */}
              <div className="max-h-60 overflow-auto">
                {selectables.length > 0 ? (
                  <div className="p-2">
                    {selectables.map((framework) => {
                      const isSelected = selected.some((s) => s.value === framework.value);
                      return (
                        <div
                          key={framework.value}
                          onClick={() => handleSelect(framework)}
                          className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
                        >
                          <div
                            className={`mr-3 h-4 w-4 border border-gray-300 rounded-sm flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className={isSelected ? 'font-medium text-blue-600' : 'text-gray-700'}>
                            {framework.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    {inputValue ? 'Không tìm thấy danh mục nào' : 'Không có danh mục'}
                  </div>
                )}
              </div>

              {/* Close button */}
              <div className="p-2 border-t border-gray-200">
                <button
                  className="w-full text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center py-2 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}