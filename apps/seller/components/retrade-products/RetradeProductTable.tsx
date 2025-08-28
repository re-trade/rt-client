'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TProduct } from '@/service/product.api';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, RefreshCw, Repeat, Tags } from 'lucide-react';
import Image from 'next/image';

const getStatusBadge = (status: string) => {
  const statusConfig = {
    ACTIVE: {
      label: 'Đang bán',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    INACTIVE: {
      label: 'Ngưng bán',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    DRAFT: {
      label: 'Bản nháp',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
    PENDING: {
      label: 'Chờ duyệt',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    DELETED: {
      label: 'Đã xóa',
      className: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    SOLD: {
      label: 'Đã bán',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: 'bg-slate-100 text-slate-800',
  };

  return (
    <Badge variant="outline" className={`${config.className}`}>
      {config.label}
    </Badge>
  );
};

const getConditionBadge = (condition: string) => {
  const conditionConfig = {
    NEW: {
      label: 'Mới',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    LIKE_NEW: {
      label: 'Như mới',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    USED_GOOD: {
      label: 'Đã qua sử dụng - Tốt',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    USED_FAIR: {
      label: 'Đã qua sử dụng - Trung bình',
      className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    DAMAGED: {
      label: 'Hư hại',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    BROKEN: {
      label: 'Hỏng',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const config = conditionConfig[condition as keyof typeof conditionConfig] || {
    label: condition,
    className: 'bg-slate-100 text-slate-800',
  };

  return (
    <Badge variant="outline" className={`${config.className}`}>
      {config.label}
    </Badge>
  );
};

const getVerifiedBadge = (verified: boolean) => {
  return verified ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      Đã xác minh
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
      Chưa xác minh
    </Badge>
  );
};

interface RetradeProductTableProps {
  products: TProduct[];
  loading: boolean;
  refreshing?: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  sortState?: { field: string; direction: 'asc' | 'desc' | null };
  sort?: { field: string; direction: 'asc' | 'desc' | null };
  onSortChange?: (field: string) => void;
  handleSortChange?: (field: string) => void;
  onRowClick?: (productId: string) => void;
}

const RetradeProductTable = ({
  products,
  loading,
  refreshing = false,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  sortState = { field: '', direction: null },
  sort,
  onSortChange,
  handleSortChange,
}: RetradeProductTableProps) => {
  const formatDate = (date: string | number[]) => {
    if (!date) return 'N/A';
    if (Array.isArray(date)) {
      const [year, month, day] = date;
      if (year !== undefined && month !== undefined && day !== undefined) {
        return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
      }
      return 'N/A';
    }
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const renderSortIcon = (field: string) => {
    const activeSortState = sort || sortState;
    if (activeSortState.field !== field) return null;
    if (activeSortState.direction === 'asc') return '↑';
    if (activeSortState.direction === 'desc') return '↓';
    return null;
  };

  const handleSort = (field: string) => {
    onSortChange?.(field) || handleSortChange?.(field);
  };

  const pageRangeStart = (currentPage - 1) * pageSize + 1;
  const pageRangeEnd = Math.min(currentPage * pageSize, totalItems);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Thông tin</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.length > 0 ? (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead
                    className={
                      handleSortChange || onSortChange ? 'cursor-pointer hover:bg-gray-100' : ''
                    }
                    onClick={() => handleSort('name')}
                  >
                    Thông tin sản phẩm {renderSortIcon('name')}
                  </TableHead>
                  <TableHead
                    className={
                      handleSortChange || onSortChange ? 'cursor-pointer hover:bg-gray-100' : ''
                    }
                    onClick={() => handleSort('sellerName')}
                  >
                    Tên người bán
                  </TableHead>
                  <TableHead
                    className={
                      handleSortChange || onSortChange ? 'cursor-pointer hover:bg-gray-100' : ''
                    }
                    onClick={() => handleSort('currentPrice')}
                  >
                    Giá {renderSortIcon('currentPrice')}
                  </TableHead>
                  <TableHead
                    className={
                      handleSortChange || onSortChange ? 'cursor-pointer hover:bg-gray-100' : ''
                    }
                    onClick={() => handleSort('brand')}
                  >
                    Thương hiệu {renderSortIcon('brand')}
                  </TableHead>
                  <TableHead
                    className={
                      handleSortChange || onSortChange ? 'cursor-pointer hover:bg-gray-100' : ''
                    }
                    onClick={() => handleSort('category')}
                  >
                    Danh mục {renderSortIcon('category')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className={`transition-colors border-slate-100 hover:bg-orange-50/30 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => onRowClick && onRowClick(product.id)}
                    data-testid={`product-row-${product.id}`}
                  >
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm">
                        <Image
                          src={product.thumbnail || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs space-y-1">
                        <div className="font-semibold line-clamp-1 text-slate-800">
                          {product.name}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {getConditionBadge(product.condition)}
                          <div
                            className="mt-1 text-xs text-orange-600 hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowClick && onRowClick(product.id);
                            }}
                          >
                            Xem chi tiết →
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{product.sellerShopName}</TableCell>

                    <TableCell>
                      <div className="font-semibold text-green-600">
                        {product.currentPrice?.toLocaleString('vi-VN')}₫
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-700 font-medium">{product.brand}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((category) => (
                          <Badge
                            key={category.id}
                            className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
                          >
                            <Tags className="w-3 h-3 mr-1" />
                            {category.name}
                          </Badge>
                        ))}
                        {product.categories.length > 2 && (
                          <Badge className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                            +{product.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            <div className="text-sm text-slate-500">
              Hiển thị {pageRangeStart} - {pageRangeEnd} của {totalItems} sản phẩm
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size} / trang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <span className="text-sm font-medium mx-2">
                    Trang {currentPage}/{totalPages || 1}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="mb-3 flex justify-center">
            <Repeat className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Không có sản phẩm retrade nào</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Bạn chưa có sản phẩm retrade nào. Sản phẩm retrade là những sản phẩm đã qua sử dụng được
            đưa lên bán lại.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
              disabled={refreshing}
              onClick={() => onPageChange(1)}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetradeProductTable;
