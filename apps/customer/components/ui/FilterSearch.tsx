'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface FilterSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  debounceDelay?: number;
}

export default function FilterSearch({
  placeholder = 'Tìm kiếm trong bộ lọc...',
  onSearch,
  className = '',
  debounceDelay = 300,
}: FilterSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, debounceDelay);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <IconSearch
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <IconX size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
