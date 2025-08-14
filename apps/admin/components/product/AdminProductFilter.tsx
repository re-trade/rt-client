'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { TFilterSelected, TProductFilter } from '@/hooks/use-product-manager';
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  DollarSign,
  FilterIcon,
  MapPin,
  Package,
  Search,
  Shield,
  Store,
  Tag,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface AdminProductFilterProps {
  filter: TProductFilter;
  selectedFilter: TFilterSelected;
  setSelectedFilter: (filter: React.SetStateAction<TFilterSelected>) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
  totalProductsCount: number;
  keyword: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function AdminProductFilter({
  filter,
  selectedFilter,
  setSelectedFilter,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  clearFilters,
  totalProductsCount,
  keyword,
  onSearch,
  loading = false,
}: AdminProductFilterProps) {
  const [searchValue, setSearchValue] = useState(keyword);
  const [priceRange, setPriceRange] = useState({
    min: selectedFilter.minPrice || '',
    max: selectedFilter.maxPrice || '',
  });

  const handleFilterChange = (key: keyof TFilterSelected, value: string | string[]) => {
    setSelectedFilter((prev) => {
      const updated = { ...prev };
      if (key === 'seller' || key === 'verified' || key === 'status' || key === 'condition') {
        updated[key] = value === 'all' ? '' : (value as string);
      } else if (Array.isArray(value)) {
        updated[key] = value as string[];
      } else if (key === 'categories' || key === 'brands' || key === 'states') {
        const currentArray = prev[key] as string[];
        updated[key] = value === 'all' ? [] : [value];
      }
      return updated;
    });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
    setPriceRange((prev) => ({ ...prev, [type]: value }));
    setSelectedFilter((prev) => ({
      ...prev,
      [`${type}Price`]: numValue,
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const formatPrice = (value: string) => {
    const numValue = value.replace(/[^\d]/g, '');
    return numValue ? parseInt(numValue, 10).toLocaleString('vi-VN') : '';
  };

  const getVerificationStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Đã xác minh';
      case 'unverified':
        return 'Chưa xác minh';
      case 'pending':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  const getProductStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'INIT':
        return 'Khởi tạo';
      case 'DELETED':
        return 'Đã xóa';
      case 'DRAFT':
        return 'Bản nháp';
      default:
        return status;
    }
  };

  return (
    <Card className="border shadow bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 w-full">
          {/* Search Bar and Stats */}
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm sản phẩm theo tên, mô tả..."
                className="w-full pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>

            <div className="flex items-center justify-between lg:justify-end gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">{totalProductsCount} sản phẩm</span>
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-1 h-8"
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa bộ lọc ({activeFiltersCount})
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-200 hover:bg-gray-50 px-3 py-1 h-8"
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                Bộ lọc
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFilter.categories.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 border-orange-200"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  Danh mục: {selectedFilter.categories.length}
                </Badge>
              )}
              {selectedFilter.brands.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <Package className="w-3 h-3 mr-1" />
                  Thương hiệu: {selectedFilter.brands.length}
                </Badge>
              )}
              {selectedFilter.states.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 border-purple-200"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  Tỉnh/TP: {selectedFilter.states.length}
                </Badge>
              )}
              {selectedFilter.verified && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Xác minh
                </Badge>
              )}
              {selectedFilter.status && (
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-700 border-indigo-200"
                >
                  <Package className="w-3 h-3 mr-1" />
                  Trạng thái SP
                </Badge>
              )}
              {selectedFilter.seller && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                  <Store className="w-3 h-3 mr-1" />
                  Người bán
                </Badge>
              )}
              {(selectedFilter.minPrice || selectedFilter.maxPrice) && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 border-emerald-200"
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Khoảng giá
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      {showFilters && (
        <CardContent className="pt-0">
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Verification Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500" />
                Trạng thái xác minh
              </Label>
              <Select
                value={selectedFilter.verified || 'all'}
                onValueChange={(value) => handleFilterChange('verified', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="true">Đã xác minh</SelectItem>
                  <SelectItem value="false">Chưa xác minh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Geographical Location Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Tỉnh/Thành phố
              </Label>
              <Select
                value={selectedFilter.states[0] || 'all'}
                onValueChange={(value) => handleFilterChange('states', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tỉnh/thành phố</SelectItem>
                  {filter.states ? (
                    filter.states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))
                  ) : (
                    <Skeleton className="h-8 w-full" />
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" />
                Danh mục
              </Label>
              <Select
                value={selectedFilter.categories[0] || 'all'}
                onValueChange={(value) => handleFilterChange('categories', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {filter.categoriesAdvanceSearch ? (
                    filter.categoriesAdvanceSearch.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <Skeleton className="h-8 w-full" />
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                Thương hiệu
              </Label>
              <Select
                value={selectedFilter.brands[0] || 'all'}
                onValueChange={(value) => handleFilterChange('brands', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  {filter.brands ? (
                    filter.brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))
                  ) : (
                    <Skeleton className="h-8 w-full" />
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Seller Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-500" />
                Người bán
              </Label>
              <Select
                value={selectedFilter.seller || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('seller', value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn người bán" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả người bán</SelectItem>
                  {filter.sellers ? (
                    filter.sellers.map((seller) => (
                      <SelectItem key={seller.sellerId} value={seller.sellerId}>
                        {seller.sellerName}
                      </SelectItem>
                    ))
                  ) : (
                    <Skeleton className="h-8 w-full" />
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Product Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                Trạng thái sản phẩm
              </Label>
              <Select
                value={selectedFilter.status || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('status', value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="INIT">Khởi tạo</SelectItem>
                  <SelectItem value="DELETED">Đã xóa</SelectItem>
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <Label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-orange-500" />
              Khoảng giá
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-600">Giá tối thiểu</Label>
                <Input
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-600">Giá tối đa</Label>
                <Input
                  placeholder="Không giới hạn"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9"
                />
              </div>
            </div>
            {(filter.minPrice > 0 || filter.maxPrice > 0) && (
              <p className="text-xs text-slate-500 mt-2">
                Khoảng giá sản phẩm: {filter.minPrice.toLocaleString('vi-VN')}₫ -{' '}
                {filter.maxPrice.toLocaleString('vi-VN')}₫
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
