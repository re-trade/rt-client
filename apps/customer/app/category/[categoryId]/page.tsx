'use client';
import ProductCard from '@/components/product/ProductCard';
import { useCategoryProducts } from '@/hooks/use-category-products';
import Pagination from '@components/common/Pagination';
import ProductCardSkeleton from '@components/product/ProductCardSkeleton';
import { IconGridDots, IconList, IconSearch, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = params;
  const {
    products,
    loading,
    isPaginating,
    searchLoading,
    handlePageChange,
    handleSearchChange,
    clearSearch,
    searchTerm,
    page,
    maxPage,
    categoryInfo,
    error,
  } = useCategoryProducts(categoryId);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-orange-100">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {categoryInfo?.name || 'Danh mục sản phẩm'}
          </h1>
          {categoryInfo?.description && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              {categoryInfo.description}
            </p>
          )}
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Tìm kiếm trong ${categoryInfo?.name || 'danh mục'}...`}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-lg text-gray-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IconX className="h-5 w-5" />
                </button>
              )}
              {searchLoading && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
            {searchTerm && (
              <div className="mt-3 text-center">
                <p className="text-gray-600">
                  Tìm kiếm: &#34;<span className="font-semibold text-orange-600">{searchTerm}</span>
                  &#34;
                  {products.length > 0 && <span className="ml-2">({products.length} kết quả)</span>}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg border border-orange-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sản phẩm
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ({products.length})
              </span>
            </h2>
            <p className="text-gray-600">
              {searchTerm
                ? `Hiển thị kết quả tìm kiếm trong ${categoryInfo?.name || 'danh mục'}`
                : `Tất cả sản phẩm trong ${categoryInfo?.name || 'danh mục'}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="btn-group">
              <button
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active bg-orange-500 border-orange-500' : 'btn-outline border-orange-200'}`}
                onClick={() => setViewMode('grid')}
              >
                <IconGridDots size={16} />
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-active bg-orange-500 border-orange-500' : 'btn-outline border-orange-200'}`}
                onClick={() => setViewMode('list')}
              >
                <IconList size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white rounded-xl shadow-lg border border-orange-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `Không tìm thấy sản phẩm nào với từ khóa "${searchTerm}" trong ${categoryInfo?.name || 'danh mục này'}`
                : `Không có sản phẩm nào trong ${categoryInfo?.name || 'danh mục này'}`}
            </p>
            {searchTerm && (
              <button
                className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700"
                onClick={clearSearch}
              >
                Xóa từ khóa tìm kiếm
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.currentPrice}
                    image={product.thumbnail}
                    shortDescription={product.shortDescription}
                    brand={product.brand}
                    verified={product.verified}
                    sellerShopName={product.sellerShopName}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={maxPage}
              onPageChange={handlePageChange}
              loading={isPaginating}
            />

            <motion.div
              className="text-center mt-8 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Hiển thị {(page - 1) * 12 + 1}-{Math.min(page * 12, products.length)} trong tổng số{' '}
              {products.length} sản phẩm
              {searchTerm && (
                <span className="ml-2 text-orange-600">(tìm kiếm: "{searchTerm}")</span>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
