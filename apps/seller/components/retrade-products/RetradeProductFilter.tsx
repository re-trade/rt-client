'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { RetradeFilterState } from '@/hooks/use-retrade-product';
import { Filter } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Slider } from '../ui/slider';

interface RetradeProductFilterProps {
  filter: RetradeFilterState;
  setFilter: Dispatch<SetStateAction<RetradeFilterState>>;
  showFilters: boolean;
  setShowFilters: Dispatch<SetStateAction<boolean>>;
  filterOptions: {
    brands: { id: string; name: string }[];
    categories: { id: string; name: string }[];
    states: string[];
    minPrice: number;
    maxPrice: number;
    priceRanges: { label: string; value: string }[];
  };
  activeFiltersCount: number;
  clearFilters: () => void;
  totalProductsCount: number;
}

export default function RetradeProductFilter({
  filter,
  setFilter,
  showFilters,
  setShowFilters,
  filterOptions,
  activeFiltersCount,
  clearFilters,
}: RetradeProductFilterProps) {
  const [localFilter, setLocalFilter] = useState<RetradeFilterState>(filter);
  const [priceSliderValue, setPriceSliderValue] = useState<number[]>([
    filter.minPrice || filterOptions.minPrice,
    filter.maxPrice || filterOptions.maxPrice,
  ]);

  useEffect(() => {
    setLocalFilter(filter);
    setPriceSliderValue([
      filter.minPrice || filterOptions.minPrice,
      filter.maxPrice || filterOptions.maxPrice,
    ]);
  }, [filter, filterOptions.minPrice, filterOptions.maxPrice]);

  const handleFilterChange = (key: keyof RetradeFilterState, value: string | number) => {
    setLocalFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceRangeChange = (rangeString: string) => {
    if (!rangeString) {
      setLocalFilter((prev) => ({
        ...prev,
        priceRange: '',
        minPrice: 0,
        maxPrice: 0,
      }));
      setPriceSliderValue([filterOptions.minPrice, filterOptions.maxPrice]);
      return;
    }

    const [min, max] = rangeString.split('-').map(Number);
    setLocalFilter((prev) => ({
      ...prev,
      priceRange: rangeString,
      minPrice: min || 0,
      maxPrice: max || 0,
    }));
    setPriceSliderValue([min || filterOptions.minPrice, max || filterOptions.maxPrice]);
  };

  const handlePriceSliderChange = (values: number[]) => {
    setPriceSliderValue(values);
    setLocalFilter((prev) => ({
      ...prev,
      priceRange: `${values[0]}-${values[1]}`,
      minPrice: values[0] || 0,
      maxPrice: values[1] || 0,
    }));
  };

  const applyFilters = () => {
    setFilter(localFilter);
  };

  const resetFilters = () => {
    clearFilters();
    setLocalFilter(filter);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(true)}
            className="border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Lọc</span>
            {activeFiltersCount > 0 && (
              <Badge
                variant="outline"
                className="rounded-full px-1 border-orange-200 bg-orange-100 text-orange-600"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-orange-500">Bộ lọc sản phẩm Retrade</SheetTitle>
                <SheetDescription>
                  Tìm kiếm sản phẩm retrade theo các tiêu chí dưới đây
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tìm kiếm</label>
                  <Input
                    placeholder="Tên sản phẩm, mô tả..."
                    value={localFilter.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <Select
                    value={localFilter.status}
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả trạng thái</SelectItem>
                      {filterOptions.states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state === 'ACTIVE'
                            ? 'Đang bán'
                            : state === 'INACTIVE'
                              ? 'Ngưng bán'
                              : state === 'PENDING'
                                ? 'Chờ duyệt'
                                : state === 'DRAFT'
                                  ? 'Bản nháp'
                                  : state === 'SOLD'
                                    ? 'Đã bán'
                                    : state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Xác minh</label>
                  <Select
                    value={localFilter.verified}
                    onValueChange={(value) => handleFilterChange('verified', value)}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Tất cả sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả sản phẩm</SelectItem>
                      <SelectItem value="true">Đã xác minh</SelectItem>
                      <SelectItem value="false">Chưa xác minh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Danh mục</label>
                  <Select
                    value={localFilter.category}
                    onValueChange={(value) => handleFilterChange('category', value)}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả danh mục</SelectItem>
                      {filterOptions.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Thương hiệu</label>
                  <Select
                    value={localFilter.brand}
                    onValueChange={(value) => handleFilterChange('brand', value)}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Tất cả thương hiệu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả thương hiệu</SelectItem>
                      {filterOptions.brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Khoảng giá</label>
                    <span className="text-xs text-slate-500">
                      {formatCurrency(priceSliderValue[0] || 0)} -{' '}
                      {formatCurrency(priceSliderValue[1] || 0)}
                    </span>
                  </div>
                  <Select value={localFilter.priceRange} onValueChange={handlePriceRangeChange}>
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Chọn khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tất cả mức giá</SelectItem>
                      {filterOptions.priceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Slider
                    defaultValue={[filterOptions.minPrice, filterOptions.maxPrice]}
                    min={filterOptions.minPrice}
                    max={filterOptions.maxPrice}
                    step={1000}
                    value={priceSliderValue}
                    onValueChange={handlePriceSliderChange}
                    className="py-4"
                    thumbClassName="bg-orange-500 border-orange-300 hover:bg-orange-600"
                    trackClassName="bg-orange-200"
                    rangeClassName="bg-orange-500"
                  />
                </div>
              </div>
              <SheetFooter className="mt-6 flex gap-3">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1 border-slate-200"
                  >
                    Đặt lại
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    onClick={applyFilters}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Áp dụng
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
