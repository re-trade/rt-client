'use client';

import Pagination from '@/components/common/Pagination';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { useSellerProducts } from '@/hooks/use-seller-products';
import {
  IconGridDots,
  IconList,
  IconPackage,
  IconRefresh,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface SellerProductsSectionProps {
  sellerId: string;
  sellerName: string;
}

const SellerProductsSection = ({ sellerId, sellerName }: SellerProductsSectionProps) => {
  const {
    products,
    loading,
    isPaginating,
    error,
    page,
    totalPages,
    totalElements,
    searchQuery,
    handlePageChange,
    handleSearch,
    refresh,
  } = useSellerProducts(sellerId);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch(searchInput);
    },
    [searchInput, handleSearch],
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    handleSearch('');
  }, [handleSearch]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        handleSearch(searchInput);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, searchQuery, handleSearch]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 mt-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
              Sản phẩm của {sellerName}
            </h2>
            <p className="text-gray-600 mt-1">Đang tải sản phẩm...</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors text-gray-900 bg-white"
                  disabled
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <button
                type="submit"
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
              >
                Tìm
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 mt-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
              Sản phẩm của {sellerName}
            </h2>
            <p className="text-gray-600 mt-1">Có lỗi xảy ra khi tải sản phẩm</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors text-gray-900 bg-white"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IconX className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Tìm
              </button>
            </form>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
            <IconPackage className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải sản phẩm</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <IconRefresh className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 mt-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
              Sản phẩm của {sellerName}
            </h2>
            <p className="text-gray-600 mt-1">
              {searchQuery ? (
                <>Không tìm thấy sản phẩm nào cho "{searchQuery}"</>
              ) : (
                <>Chưa có sản phẩm nào</>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors text-gray-900 bg-white"
                />
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IconX className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Tìm
              </button>
            </form>
          </div>
        </div>
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
            <IconPackage className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchQuery ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery ? (
              <>
                Không có sản phẩm nào khớp với từ khóa "{searchQuery}". Hãy thử tìm kiếm với từ khóa
                khác.
              </>
            ) : (
              <>
                {sellerName} chưa có sản phẩm nào để hiển thị. Hãy quay lại sau để xem các sản phẩm
                mới.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 mt-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded"></div>
            Sản phẩm của {sellerName}
          </h2>
          <p className="text-gray-600 mt-1">
            {searchQuery ? (
              <>
                Tìm thấy {totalElements} sản phẩm cho "{searchQuery}"
              </>
            ) : (
              <>Hiển thị {totalElements} sản phẩm</>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-64 pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors text-gray-900 bg-white"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Tìm
            </button>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-gray-800'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <IconGridDots className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-gray-800'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              <IconList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProductCard
              id={product.id}
              image={product.thumbnail}
              name={product.name}
              price={product.currentPrice}
              shortDescription={product.shortDescription}
              brand={product.brand}
              verified={product.verified}
              sellerShopName={product.sellerShopName}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            loading={isPaginating}
            theme="default"
            showInfo={true}
            showQuickJump={totalPages > 10}
            size="md"
          />
        </div>
      )}
    </div>
  );
};

export default SellerProductsSection;
