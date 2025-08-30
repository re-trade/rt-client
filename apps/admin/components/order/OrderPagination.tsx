'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OrderPaginationProps {
  page: number;
  maxPage: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
}

export default function OrderPagination({
  page,
  maxPage,
  totalOrders,
  onPageChange,
}: OrderPaginationProps) {
  return (
    <div className="flex items-center justify-between p-6 border-t border-slate-200">
      <div className="text-sm text-slate-600">
        Hiển thị trang {page} trong số {maxPage} trang • Tổng {totalOrders} đơn hàng
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1 || maxPage <= 1}
          onClick={() => onPageChange(page - 1)}
          className="border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>

        <div className="flex items-center gap-1">
          {maxPage > 1 ? (
            Array.from({ length: Math.min(5, maxPage) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={`h-8 w-8 p-0 ${
                    page === pageNum
                      ? 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500'
                      : 'border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300'
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })
          ) : (
            <Button
              variant="default"
              size="sm"
              className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
              disabled
            >
              1
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={page === maxPage || maxPage <= 1}
          onClick={() => onPageChange(page + 1)}
          className="border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
