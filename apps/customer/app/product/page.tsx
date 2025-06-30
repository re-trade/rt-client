'use client';

import ProductFilter from '@/components/common/FillterProduct';
import ProductCard from '@/components/product/ProductCard';
import { useProductList } from '@/hooks/use-product-list';
import { motion } from 'framer-motion';

export default function ProductListPage() {
  const {
    allProducts,
    loading,
    isPaginating,
    filter,
    filterLoading,
    handleFilterChange,
    loadMore,
  } = useProductList();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="sticky top-4 space-y-6 bg-white p-6 rounded-xl shadow-sm">
            <ProductFilter
              filter={filter}
              onChange={handleFilterChange}
              isLoading={filterLoading}
              availableOptions={{
                categories: filter?.categoriesAdvanceSearch ?? [],
                brands: filter?.brands ?? [],
                states: filter?.states ?? [],
                sellers: filter?.sellers ?? [],
              }}
            />
          </div>
        </aside>

        <main className="md:col-span-3">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Sản phẩm ({allProducts.length})
          </h1>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-72 bg-white rounded-xl shadow animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              ))}
            </div>
          ) : allProducts.length === 0 ? (
            <p className="text-gray-500">Không có sản phẩm phù hợp.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
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
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isPaginating}
                  className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {isPaginating ? 'Đang tải...' : 'Tải thêm'}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
