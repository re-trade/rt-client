'use client';

import { TProductFilter } from '@services/product.api';
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
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const LoadingFilterSection = ({ title }: { title: string }) => (
  <div className="flex flex-col gap-2">
    <label className="font-bold">{title}</label>
    <div className="flex flex-wrap gap-2">
      {[...Array(3)].map((_, i) => (
        <LoadingSkeleton key={i} className="h-8 w-20" />
      ))}
    </div>
  </div>
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 bg-white text-black p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải bộ lọc...</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold">Tìm theo tên sản phẩm</label>
          <LoadingSkeleton className="h-10 w-full" />
        </div>

        <LoadingFilterSection title="Danh mục" />
        <LoadingFilterSection title="Thương hiệu" />
        <LoadingFilterSection title="Trạng thái" />
        <LoadingFilterSection title="Người bán" />

        <div>
          <LoadingSkeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-white text-black p-6 rounded-xl shadow-sm transition-all duration-300 ease-in-out">
      {availableCategories.length > 0 && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <label className="font-bold">Danh mục</label>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category, index) => {
              const isSelected = localFilter.categoriesAdvanceSearch.some(
                (cat) => cat.id === category.id,
              );
              return (
                <div
                  key={category.id}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:shadow-sm'
                  }`}
                  onClick={() => toggleCategorySelect(category)}
                >
                  {category.name}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {availableBrands.length > 0 && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <label className="font-bold">Thương hiệu</label>
          <div className="flex flex-wrap gap-2">
            {availableBrands.map((brand) => {
              const isSelected = localFilter.brands.some((b) => b.id === brand.id);
              return (
                <div
                  key={brand.id}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-green-500 text-white border-green-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-500 hover:shadow-sm'
                  }`}
                  onClick={() => toggleBrandSelect(brand)}
                >
                  {brand.imgUrl && (
                    <img
                      src={brand.imgUrl}
                      alt={brand.name}
                      className="w-4 h-4 rounded transition-transform duration-200"
                    />
                  )}
                  {brand.name}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {availableStates.length > 0 && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <label className="font-bold">Trạng thái</label>
          <div className="flex flex-wrap gap-2">
            {availableStates.map((state) => {
              const isSelected = localFilter.states.includes(state);
              return (
                <div
                  key={state}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500 hover:shadow-sm'
                  }`}
                  onClick={() => toggleStateSelect(state)}
                >
                  {state}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {availableSellers.length > 0 && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <label className="font-bold">Người bán</label>
          <div className="flex flex-wrap gap-2">
            {availableSellers.map((seller) => {
              const isSelected = localFilter.sellers.some((s) => s.sellerId === seller.sellerId);
              return (
                <div
                  key={seller.sellerId}
                  className={`px-3 py-1 rounded-full border cursor-pointer transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:shadow-sm'
                  }`}
                  onClick={() => toggleSellerSelect(seller)}
                >
                  {seller.sellerAvatarUrl && (
                    <img
                      src={seller.sellerAvatarUrl}
                      alt={seller.sellerName}
                      className="w-4 h-4 rounded-full transition-transform duration-200"
                    />
                  )}
                  {seller.sellerName}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <button
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 hover:shadow-sm"
          onClick={resetFilter}
        >
          Đặt lại bộ lọc
        </button>
      </motion.div>
    </div>
  );
}
