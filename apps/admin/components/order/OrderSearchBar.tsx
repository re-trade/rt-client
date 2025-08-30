'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface OrderSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export default function OrderSearchBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
}: OrderSearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 sm:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Tìm kiếm theo ID combo, tên người bán..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
