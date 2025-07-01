'use client';

import { TFilterSelected } from '@/hooks/use-product-list';
import { TProductFilter } from '@services/product.api';
import {
  IconBuildingStore,
  IconCategory,
  IconMapPin,
  IconRefresh,
  IconUser,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';

const FilterChip = ({
  children,
  isSelected,
  onClick,
  color = 'orange',
  className = '',
}: {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  color?: 'orange' | 'blue' | 'green' | 'purple';
  className?: string;
}) => {
  const colorVariants = {
    orange: isSelected
      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg'
      : 'bg-white text-gray-700 border-orange-200 hover:border-orange-400 hover:bg-orange-50',
    blue: isSelected
      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg'
      : 'bg-white text-gray-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50',
    green: isSelected
      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg'
      : 'bg-white text-gray-700 border-green-200 hover:border-green-400 hover:bg-green-50',
    purple: isSelected
      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-lg'
      : 'bg-white text-gray-700 border-purple-200 hover:border-purple-400 hover:bg-purple-50',
  };

  return (
    <button
      className={`px-4 py-2 rounded-full border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md font-medium text-sm ${colorVariants[color]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const FilterSection = ({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className="flex items-center gap-2 text-gray-700 pb-2 border-b border-orange-100">
      {icon}
      <label className="font-semibold text-sm">{title}</label>
    </div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </motion.div>
);

type ProductFilterProps = {
  selectedFilter: TFilterSelected;
  filter: TProductFilter;
  filterLoading: boolean;
  handleFilterReset: () => void;
  handleSelectedFilterChange: (
    key: keyof TFilterSelected,
    value: string | number | string[] | number[],
  ) => void;
};

export default function ProductFilter({
  selectedFilter,
  filter,
  filterLoading,
  handleFilterReset,
  handleSelectedFilterChange,
}: ProductFilterProps) {
  const handleSelectChange = useCallback(
    (key: keyof typeof selectedFilter, value: string) => {
      handleSelectedFilterChange(key, value);
    },
    [handleSelectedFilterChange],
  );

  const hasActiveFilters =
    selectedFilter.categories.length > 0 ||
    selectedFilter.brands.length > 0 ||
    selectedFilter.states.length > 0 ||
    selectedFilter.seller;

  if (filterLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-orange-100 rounded w-1/3"></div>
        <div className="h-10 bg-orange-100 rounded"></div>
        <div className="h-6 bg-orange-100 rounded w-2/3"></div>
        <div className="h-10 bg-orange-100 rounded"></div>
        <div className="h-10 bg-orange-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden transition-all duration-300 ease-in-out">
      {hasActiveFilters && (
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 text-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {selectedFilter.categories.length +
              selectedFilter.brands.length +
              selectedFilter.states.length +
              selectedFilter.seller
                ? 1
                : 0}{' '}
              bộ lọc đang áp dụng
            </span>
          </div>
        </motion.div>
      )}

      <div className="p-6 space-y-6">
        {filter.categoriesAdvanceSearch.length > 0 && (
          <FilterSection
            title="Danh mục"
            icon={<IconCategory size={16} className="text-orange-500" />}
            delay={0.1}
          >
            {filter.categoriesAdvanceSearch.map((item) => {
              const isCategorySelected = selectedFilter.categories.includes(item.id);
              return (
                <FilterChip
                  key={item.id}
                  isSelected={isCategorySelected}
                  onClick={() => handleSelectChange('categories', item.id)}
                  color="blue"
                >
                  {item.name}
                </FilterChip>
              );
            })}
          </FilterSection>
        )}

        {filter.brands.length > 0 && (
          <FilterSection
            title="Thương hiệu"
            icon={<IconBuildingStore size={16} className="text-orange-500" />}
            delay={0.2}
          >
            {filter.brands.map((brand) => {
              const isBrandSelected = selectedFilter.brands.includes(brand.id);
              return (
                <FilterChip
                  key={brand.id}
                  isSelected={isBrandSelected}
                  onClick={() => handleSelectChange('brands', brand.id)}
                  color="green"
                  className="flex items-center gap-2"
                >
                  {brand?.imgUrl && (
                    <img
                      src={brand.imgUrl}
                      alt={brand.name}
                      className="w-4 h-4 rounded transition-transform duration-200"
                    />
                  )}
                  {brand?.name}
                </FilterChip>
              );
            })}
          </FilterSection>
        )}

        {filter.states.length > 0 && (
          <FilterSection
            title="Tỉnh/Thành Phố"
            icon={<IconMapPin size={16} className="text-orange-500" />}
            delay={0.3}
          >
            {filter.states.map((state) => (
              <FilterChip
                key={state}
                isSelected={selectedFilter.states.includes(state)}
                onClick={() => handleSelectChange('states', state)}
                color="purple"
              >
                {state}
              </FilterChip>
            ))}
          </FilterSection>
        )}

        {filter.sellers.length > 0 && (
          <FilterSection
            title="Người bán"
            icon={<IconUser size={16} className="text-orange-500" />}
            delay={0.4}
          >
            {filter.sellers.map((seller) => {
              const isSellerSelected =
                selectedFilter.seller !== null && selectedFilter.seller === seller.sellerId;
              return (
                <FilterChip
                  key={seller.sellerId}
                  isSelected={isSellerSelected}
                  onClick={() => handleSelectChange('seller', seller.sellerId)}
                  color="orange"
                >
                  {seller.sellerName}
                </FilterChip>
              );
            })}
          </FilterSection>
        )}

        {/*<FilterSection*/}
        {/*  title="Khoảng giá"*/}
        {/*  icon={<span className="text-orange-500 font-bold">₫</span>}*/}
        {/*  delay={0.5}*/}
        {/*>*/}
        {/*  <div className="w-full flex gap-2">*/}
        {/*    <input*/}
        {/*      type="number"*/}
        {/*      className="input input-sm w-full border border-orange-300"*/}
        {/*      placeholder="Giá thấp nhất"*/}
        {/*      value={selectedFilter.minPrice || ''}*/}
        {/*      onChange={(e) =>*/}
        {/*        handleSelectedFilterChange('minPrice', parseInt(e.target.value || '0'))*/}
        {/*      }*/}
        {/*    />*/}
        {/*    <span className="px-2 py-1 text-sm text-gray-500">–</span>*/}
        {/*    <input*/}
        {/*      type="number"*/}
        {/*      className="input input-sm w-full border border-orange-300"*/}
        {/*      placeholder="Giá cao nhất"*/}
        {/*      value={selectedFilter.maxPrice || ''}*/}
        {/*      onChange={(e) =>*/}
        {/*        handleSelectedFilterChange('maxPrice', parseInt(e.target.value || '0'))*/}
        {/*      }*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</FilterSection>*/}

        <motion.div
          className="pt-4 border-t border-orange-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <button
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              hasActiveFilters
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
            }`}
            onClick={handleFilterReset}
            disabled={!hasActiveFilters}
          >
            <IconRefresh size={18} className={hasActiveFilters ? 'animate-spin' : ''} />
            {hasActiveFilters ? 'Xóa tất cả bộ lọc' : 'Đặt lại bộ lọc'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
