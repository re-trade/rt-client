'use client';
import { Input } from '@/components/ui/input';
import type React from 'react';

import { cn } from '@/lib/utils';
import { type Category, getAllCategories } from '@/service/categories.api';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onChange: (selected: string[]) => void;
  value?: string[];
  currentCategoryId?: { id: string; name: string }[];
}

export function MultiSelectCategory({
  onChange,
  value: initialValue = [],
  currentCategoryId,
}: Props) {
  const [search, setSearch] = useState('');
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('MultiSelectCategory props:', {
      currentCategoryId,
      initialValue,
      selected,
      categoriesLoaded,
    });
  }, [currentCategoryId, initialValue, selected, categoriesLoaded]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categories = await getAllCategories();
        setAllCategories(categories);
        setFilteredCategories(categories);
        setCategoriesLoaded(true);
        console.log('Categories loaded:', categories.length);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Set initial selected values after categories are loaded
  useEffect(() => {
    if (!categoriesLoaded) return;

    console.log('Setting initial values - categoriesLoaded:', categoriesLoaded);
    console.log('currentCategoryId:', currentCategoryId);
    console.log('initialValue:', initialValue);

    // Ưu tiên currentCategoryId trước
    if (currentCategoryId && Array.isArray(currentCategoryId) && currentCategoryId.length > 0) {
      console.log('Setting selected from currentCategoryId:', currentCategoryId);
      setSelected(currentCategoryId);
    } else if (initialValue && Array.isArray(initialValue) && initialValue.length > 0) {
      console.log('Setting selected from initialValue:', initialValue);
      setSelected(initialValue);
    } else {
      console.log('No initial values to set');
      setSelected([]);
    }
  }, [categoriesLoaded, currentCategoryId, initialValue]);

  // Sync với currentCategoryId khi nó thay đổi (sau khi categories đã load)
  useEffect(() => {
    if (!categoriesLoaded) return;

    if (currentCategoryId && Array.isArray(currentCategoryId)) {
      console.log('Syncing with currentCategoryId:', currentCategoryId);
      setSelected(currentCategoryId);
    }
  }, [currentCategoryId, categoriesLoaded]);

  // Filter categories based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCategories(allCategories);
    } else {
      const filtered = allCategories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredCategories(filtered);
    }
  }, [search, allCategories]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsSearching(false);
        setSearch('');
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleToggleCategory = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter((cid) => cid !== id)
      : [...selected, id];

    console.log('Toggle category:', id, 'New selected:', newSelected);
    setSelected(newSelected);
    onChange(newSelected);
  };

  const handleRemoveCategory = (id: string) => {
    const newSelected = selected.filter((cid) => cid !== id);
    console.log('Remove category:', id, 'New selected:', newSelected);
    setSelected(newSelected);
    onChange(newSelected);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsSearching(true);
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
    setIsSearching(true);
    setSearch('');
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
    setIsSearching(true);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsSearching(false);
      setSearch('');
      inputRef.current?.blur();
    }
  };

  const getSelectedCategories = () => {
    const selectedCats = selected
      .map((id) => allCategories.find((c) => c.id === id))
      .filter(Boolean) as Category[];
    console.log('getSelectedCategories:', selectedCats);
    return selectedCats;
  };

  const getDisplayValue = () => {
    if (isSearching) {
      return search;
    }
    return '';
  };

  const getPlaceholder = () => {
    if (loading) return 'Đang tải...';
    return 'Tìm kiếm và chọn danh mục...';
  };

  // Debug render
  console.log('Render - selected:', selected, 'categories loaded:', categoriesLoaded);

  return (
    <div ref={containerRef} className="space-y-3 w-full">
      {selected.length > 0 && categoriesLoaded && (
        <div className="flex flex-wrap gap-2">
          {getSelectedCategories().map((category) => (
            <div
              key={category.id}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
            >
              <span>{category.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveCategory(category.id)}
                className="inline-flex items-center justify-center w-4 h-4 ml-1 text-blue-600 hover:text-blue-800 hover:bg-blue-300 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`Xóa ${category.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input and dropdown */}
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder={getPlaceholder()}
            value={getDisplayValue()}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="pr-8"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              if (isDropdownOpen) {
                setIsDropdownOpen(false);
                setIsSearching(false);
                setSearch('');
              } else {
                setIsDropdownOpen(true);
                setIsSearching(true);
                setSearch('');
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isDropdownOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 z-50 w-full mt-1">
            <div className="rounded-md border bg-white shadow-lg max-h-60 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                <div className="p-1">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-colors',
                        selected.includes(category.id) && 'bg-blue-50',
                      )}
                      onClick={() => handleToggleCategory(category.id)}
                    >
                      <span
                        className={cn(
                          'text-sm',
                          selected.includes(category.id) && 'font-medium text-blue-700',
                        )}
                      >
                        {category.name}
                      </span>
                      {selected.includes(category.id) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  {search ? 'Không tìm thấy danh mục nào' : 'Không có danh mục'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected count */}
      {selected.length > 0 && (
        <div className="text-xs text-gray-500">Đã chọn {selected.length} danh mục</div>
      )}
    </div>
  );
}
