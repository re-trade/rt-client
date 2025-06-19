'use client';

import CarouselComponent from '@/components/Carousel';
import ProductCard from '@/components/product/ProductCard';
import { useProductHome } from '@/hooks/use-product-home';

export default function Home() {
  const {
    products,
    categories,
    selectedCategoryId,
    selectCategory,
    loading,
    categoriesLoading,
    error,
  } = useProductHome();

  const ProductSection = ({
    title,
    showLoading = false,
  }: {
    title: string;
    showLoading?: boolean;
  }) => (
    <section className="bg-white p-6 rounded-lg border border-orange-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {title}
          {title === 'Được quan tâm' && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">HOT</span>
          )}
          {selectedCategoryId && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
              {categories.find((cat) => cat.id === selectedCategoryId)?.name || 'Đã lọc'}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {selectedCategoryId && (
            <button
              onClick={() => selectCategory(null)}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Bỏ lọc
            </button>
          )}
          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1 transition-colors">
            Xem tất cả
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {showLoading && loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-orange-100 rounded-lg overflow-hidden">
              <div className="h-48 bg-orange-100 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 bg-orange-100 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-orange-100 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-3 bg-orange-100 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.currentPrice}
              image={product.thumbnail}
              shortDescription={product.shortDescription}
              brand={product.brand}
              verified={product.verified}
              sellerShopName={product.sellerShopName}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {selectedCategoryId ? 'Không có sản phẩm trong danh mục này' : 'Chưa có sản phẩm nào'}
          </h3>
          <p className="text-gray-500">
            {selectedCategoryId
              ? 'Thử chọn danh mục khác hoặc quay lại sau!'
              : 'Hãy quay lại sau để xem thêm đồ cũ thú vị!'}
          </p>
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="w-full space-y-6 mb-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <CarouselComponent />
        </div>
        <div className="container mx-auto px-4">
          <div className="bg-white py-4 px-6 rounded-lg shadow-sm border border-orange-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Danh mục sản phẩm
            </h2>
            {categoriesLoading ? (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="whitespace-nowrap bg-orange-100 h-8 w-20 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                <button
                  onClick={() => selectCategory(null)}
                  className={`whitespace-nowrap px-3 py-2 rounded-full transition-colors text-sm font-medium ${
                    selectedCategoryId === null
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  Tất cả
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    className={`whitespace-nowrap px-3 py-2 rounded-full transition-colors text-sm font-medium ${
                      selectedCategoryId === category.id
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <ProductSection title="Được quan tâm" showLoading={true} />
        <ProductSection title="Mới Đăng Gần Đây" />
      </div>
      <section className="bg-white py-16 px-4 mt-16 border-t border-orange-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cách hoạt động</h2>
            <p className="text-gray-600">Mua bán đồ cũ đơn giản, chỉ với 3 bước</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Đăng đồ bạn muốn bán',
                description: 'Chụp ảnh, mô tả và đăng tin miễn phí.',
                icon: '📤',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                step: '2',
                title: 'Tìm đồ cũ yêu thích',
                description: 'Duyệt qua hàng ngàn món đồ cũ chất lượng.',
                icon: '🔍',
                color: 'bg-green-100 text-green-600',
              },
              {
                step: '3',
                title: 'Liên hệ & mua bán',
                description: 'Chat trực tiếp với người bán để thỏa thuận.',
                icon: '🤝',
                color: 'bg-orange-100 text-orange-600',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-orange-50 border border-orange-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${item.color} font-bold text-sm mb-4`}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto">
              Bắt đầu ngay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5-5 5M5 7l5 5-5 5"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
