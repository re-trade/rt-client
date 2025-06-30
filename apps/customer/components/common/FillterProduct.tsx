'use client';

import { TProductFilter } from '@services/product.api';
import {
  IconBuildingStore,
  IconCategory,
  IconMapPin,
  IconRefresh,
  IconUser,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

type ProductFilterProps = {
  filter: TProductFilter;
  onChange: (filter: TProductFilter) => void;
  availableOptions: {
    categories: { id: string; name: string }[];
    brands: { id: string; name: string; imgUrl: string }[];
    states: string[];
    sellers: { sellerId: string; sellerName: string; sellerAvatarUrl: string }[];
  };
  isLoading?: boolean;
};

const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-orange-100 to-orange-200 rounded ${className}`}
  ></div>
);

const LoadingFilterSection = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
  <motion.div
    className="space-y-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center gap-2 text-gray-700">
      {icon}
      <label className="font-semibold text-sm">{title}</label>
    </div>
    <div className="flex flex-wrap gap-2">
      {[...Array(3)].map((_, i) => (
        <LoadingSkeleton key={i} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  </motion.div>
);

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
      className={`px-4 py-2 rounded-full border-2 cursor-pointer transition-all duration-300
        transform hover:scale-105 hover:shadow-md font-medium text-sm
        ${colorVariants[color]} ${className}`}
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

export default function ProductFilter({
  filter,
  onChange,
  availableOptions,
  isLoading = false,
}: ProductFilterProps) {
  const [localFilter, setLocalFilter] = useState(filter);
  const {
    categories: availableCategories,
    brands: availableBrands,
    states: availableStates,
    sellers: availableSellers,
  } = availableOptions;

  const handleChange = (key: keyof TProductFilter, value: any) => {
    const updated = { ...localFilter, [key]: value };
    setLocalFilter(updated);
    onChange(updated);
  };

  const toggleCategorySelect = (category: { id: string; name: string }) => {
    const isSelected = localFilter.categoriesAdvanceSearch.some((cat) => cat.id === category.id);
    const updated = isSelected
      ? localFilter.categoriesAdvanceSearch.filter((cat) => cat.id !== category.id)
      : [...localFilter.categoriesAdvanceSearch, category];
    handleChange('categoriesAdvanceSearch', updated);
  };

  const toggleBrandSelect = (brand: { id: string; name: string; imgUrl: string }) => {
    const isSelected = localFilter.brands.some((b) => b.id === brand.id);
    const updated = isSelected
      ? localFilter.brands.filter((b) => b.id !== brand.id)
      : [...localFilter.brands, brand];
    handleChange('brands', updated);
  };

  const toggleStateSelect = (state: string) => {
    const isSelected = localFilter.states.includes(state);
    const updated = isSelected
      ? localFilter.states.filter((s) => s !== state)
      : [...localFilter.states, state];
    handleChange('states', updated);
  };

  const toggleSellerSelect = (seller: {
    sellerId: string;
    sellerName: string;
    sellerAvatarUrl: string;
  }) => {
    const isSelected = localFilter.sellers.some((s) => s.sellerId === seller.sellerId);
    const updated = isSelected
      ? localFilter.sellers.filter((s) => s.sellerId !== seller.sellerId)
      : [...localFilter.sellers, seller];
    handleChange('sellers', updated);
  };

  const resetFilter = () => {
    const resetFilter: TProductFilter = {
      categoriesAdvanceSearch: [],
      brands: [],
      states: [],
      sellers: [],
    };
    setLocalFilter(resetFilter);
    onChange(resetFilter);
  };

  const hasActiveFilters =
    localFilter.categoriesAdvanceSearch.length > 0 ||
    localFilter.brands.length > 0 ||
    localFilter.states.length > 0 ||
    localFilter.sellers.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6 bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4">
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Đang tải bộ lọc...</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <LoadingFilterSection
            title="Danh mục"
            icon={<IconCategory size={16} className="text-orange-500" />}
          />
          <LoadingFilterSection
            title="Thương hiệu"
            icon={<IconBuildingStore size={16} className="text-orange-500" />}
          />
          <LoadingFilterSection
            title="Tỉnh/Thành Phố"
            icon={<IconMapPin size={16} className="text-orange-500" />}
          />
          <LoadingFilterSection
            title="Người bán"
            icon={<IconUser size={16} className="text-orange-500" />}
          />

          <div className="pt-4 border-t border-orange-100">
            <LoadingSkeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
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
              {localFilter.categoriesAdvanceSearch.length +
                localFilter.brands.length +
                localFilter.states.length +
                localFilter.sellers.length}{' '}
              bộ lọc đang áp dụng
            </span>
          </div>
        </motion.div>
      )}

      <div className="p-6 space-y-6">
        {availableCategories.length > 0 && (
          <FilterSection
            title="Danh mục"
            icon={<IconCategory size={16} className="text-orange-500" />}
            delay={0.1}
          >
            {availableCategories.map((category) => {
              const isSelected = localFilter.categoriesAdvanceSearch.some(
                (cat) => cat.id === category.id,
              );
              return (
                <FilterChip
                  key={category.id}
                  isSelected={isSelected}
                  onClick={() => toggleCategorySelect(category)}
                  color="blue"
                >
                  {category.name}
                </FilterChip>
              );
            })}
          </FilterSection>
        )}
        {availableBrands.length > 0 && (
          <FilterSection
            title="Thương hiệu"
            icon={<IconBuildingStore size={16} className="text-orange-500" />}
            delay={0.2}
          >
            {availableBrands.map((brand) => {
              const isSelected = localFilter.brands.some((b) => b.id === brand.id);
              return (
                <FilterChip
                  key={brand.id}
                  isSelected={isSelected}
                  onClick={() => toggleBrandSelect(brand)}
                  color="green"
                  className="flex items-center gap-2"
                >
                  {brand.imgUrl && (
                    <img
                      src={brand.imgUrl}
                      alt={brand.name}
                      className="w-4 h-4 rounded transition-transform duration-200"
                    />
                  )}
                  {brand.name}
                </FilterChip>
              );
            })}
          </FilterSection>
        )}
        {availableStates.length > 0 && (
          <FilterSection
            title="Tỉnh/Thành Phố"
            icon={<IconMapPin size={16} className="text-orange-500" />}
            delay={0.3}
          >
            {availableStates.map((state) => {
              const isSelected = localFilter.states.includes(state);
              return (
                <FilterChip
                  key={state}
                  isSelected={isSelected}
                  onClick={() => toggleStateSelect(state)}
                  color="purple"
                >
                  {state}
                </FilterChip>
              );
            })}
          </FilterSection>
        )}
        {availableSellers.length > 0 && (
          <FilterSection
            title="Người bán"
            icon={<IconUser size={16} className="text-orange-500" />}
            delay={0.4}
          >
            {availableSellers.map((seller) => {
              const isSelected = localFilter.sellers.some((s) => s.sellerId === seller.sellerId);
              return (
                <FilterChip
                  key={seller.sellerId}
                  isSelected={isSelected}
                  onClick={() => toggleSellerSelect(seller)}
                  color="orange"
                >
                  {seller.sellerName}
                </FilterChip>
              );
            })}
          </FilterSection>
        )}

        <motion.div
          className="pt-4 border-t border-orange-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <button
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              hasActiveFilters
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
            }`}
            onClick={resetFilter}
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
