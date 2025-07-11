'use client';
import ProductCard from '@/components/product/ProductCard';
import { useProductList } from '@/hooks/use-product-list';
import PaginationBar from '@components/common/PaginationBar';
import ProductFilter from '@components/product/FillterProduct';
import ProductCardSkeleton from '@components/product/ProductCardSkeleton';
import { IconFilter, IconGridDots, IconList } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductListPage() {
  const {
    products,
    loading,
    isPaginating,
    filter,
    filterLoading,
    handlePageChange,
    handleFilterReset,
    handleSelectedFilterChange,
    selectedFilter,
    page,
    maxPage,
  } = useProductList();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const productsPerPage = 12;
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <motion.div
              className="sticky top-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                  <div className="flex items-center gap-2">
                    <IconFilter size={20} />
                    <h2 className="font-bold text-lg">Bộ lọc sản phẩm</h2>
                  </div>
                </div>

                <ProductFilter
                  selectedFilter={selectedFilter}
                  filter={filter}
                  handleFilterReset={handleFilterReset}
                  handleSelectedFilterChange={handleSelectedFilterChange}
                  filterLoading={filterLoading}
                />
              </div>
            </motion.div>
          </aside>

          <main className="lg:col-span-3">
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg border border-orange-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Sản phẩm
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    ({filteredProducts.length})
                  </span>
                </h2>
                {searchTerm && (
                  <p className="text-gray-600">
                    Kết quả tìm kiếm cho: &#34;
                    <span className="font-semibold text-orange-600">{searchTerm}</span>&#34;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
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
            ) : filteredProducts.length === 0 ? (
              <motion.div
                className="text-center py-16 bg-white rounded-xl shadow-lg border border-orange-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
                </p>
                <button
                  className="btn bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none hover:from-orange-600 hover:to-orange-700"
                  onClick={() => {
                    setSearchTerm('');
                    handlePageChange(0);
                  }}
                >
                  Xóa bộ lọc
                </button>
              </motion.div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
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
                      />
                    </motion.div>
                  ))}
                </div>

                <PaginationBar
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
                  Hiển thị {page + 1}-{Math.min(page + productsPerPage, filteredProducts.length)}{' '}
                  trong tổng số {filteredProducts.length} sản phẩm
                </motion.div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
