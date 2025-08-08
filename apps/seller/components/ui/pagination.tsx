'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  loading?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 20, 50],
  loading = false,
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 py-4', className)}
    >
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Hiển thị {startItem}-{endItem} trên {totalItems} kết quả
        </span>
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Hiển thị:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger className="w-20 h-8 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading || totalPages <= 1}
          className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <div key={`dots-${index}`} className="flex h-8 w-8 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                disabled={loading || totalPages <= 1}
                className={cn(
                  'h-8 w-8 p-0',
                  isCurrentPage && 'bg-orange-500 text-white hover:bg-orange-600',
                  !isCurrentPage && 'border-gray-200 hover:bg-gray-50 hover:border-gray-300',
                )}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading || totalPages <= 1}
          className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
