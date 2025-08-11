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
import { FilterState } from '@/hooks/use-product';
import { ProductFilterResponse } from '@/service/product.api';
import { BarChart3, ChevronDown, FilterIcon, Search, X } from 'lucide-react';

interface ProductFilterProps {
  filter: FilterState;
  setFilter: (filter: React.SetStateAction<FilterState>) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filterOptions: {
    brands: ProductFilterResponse['brands'];
    categories: ProductFilterResponse['categoriesAdvanceSearch'];
    states: ProductFilterResponse['states'];
    priceRanges: { label: string; value: string }[];
    minPrice: ProductFilterResponse['minPrice'];
    maxPrice: ProductFilterResponse['maxPrice'];
  };
  activeFiltersCount: number;
  clearFilters: () => void;
  totalProductsCount: number;
}

export default function ProductFilter({
  filter,
  setFilter,
  showFilters,
  setShowFilters,
  filterOptions,
  activeFiltersCount,
  clearFilters,
  totalProductsCount,
}: ProductFilterProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value === 'all' ? '' : value }));
  };

  return (
    <Card className="border shadow bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm theo tên..."
              className="w-full flex-1 pl-10 border-gray-200 h-9"
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 mt-2 md:mt-0">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">{totalProductsCount} sản phẩm</span>
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
          <div className="flex justify-end mt-2 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative border-gray-200 hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <FilterIcon className="w-4 h-4 mr-1" /> Bộ lọc
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {showFilters && (
        <CardContent className="pt-0">
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Trạng thái</Label>
              <Select
                value={filter.status === '' ? 'all' : filter.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                  <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                  <SelectItem value="DRAFT">Nháp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Xác minh</Label>
              <Select
                value={filter.verified === '' ? 'all' : filter.verified}
                onValueChange={(value) => handleFilterChange('verified', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn trạng thái xác minh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="true">Đã xác minh</SelectItem>
                  <SelectItem value="false">Chưa xác minh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Danh mục</Label>
              <Select
                value={filter.category === '' ? 'all' : filter.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {filterOptions.categories ? (
                    filterOptions.categories.map((category) => (
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Thương hiệu</Label>
              <Select
                value={filter.brand === '' ? 'all' : filter.brand}
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {filterOptions.brands ? (
                    filterOptions.brands.map((brand) => (
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Khoảng giá</Label>
              <Select
                value={filter.priceRange === '' ? 'all' : filter.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 h-9">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {filterOptions.priceRanges ? (
                    filterOptions.priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))
                  ) : (
                    <Skeleton className="h-8 w-full" />
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
