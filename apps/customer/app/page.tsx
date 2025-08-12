'use client';

import CarouselComponent from '@/components/Carousel';
import { CategorySelector } from '@/components/category/CategorySelector';
import ProductCard from '@/components/product/ProductCard';
import { useProductHome } from '@/hooks/use-product-home';
import { useProductList } from '@/hooks/use-product-list';
import { TProduct } from '@/services/product.api';
import {
  ChevronRight,
  Clock,
  Grid3X3,
  MessageCircle,
  Package,
  Search,
  ShoppingCart,
  Smile,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const {
    products,
    categories,
    selectedCategoryId,
    selectCategory,
    loading,
    categoriesLoading,
    homeStats,
    bestSellerProducts,
    error,
  } = useProductHome();
  const router = useRouter();
  const { handleSelectedFilterChange } = useProductList();

  const handleSelectCategory = (categoryId: string | null) => {
    if (categoryId) {
      handleSelectedFilterChange('categories', [categoryId]);
    }
    router.push(`/category/${categoryId || ''}`);
  };

  const ProductSection = ({
    title,
    showLoading = false,
    icon,
    subtitle,
    items = [],
  }: {
    title: string;
    showLoading?: boolean;
    icon: React.ReactNode;
    subtitle?: string;
    items?: TProduct[];
  }) => (
    <section className="bg-white p-6 sm:p-8 rounded-xl border border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">{icon}</div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              {title}
              {title === 'Được mua nhiều' && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                  HOT
                </span>
              )}
              {selectedCategoryId && (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium border border-orange-200">
                  {categories.find((cat) => cat.id === selectedCategoryId)?.name || 'Đã lọc'}
                </span>
              )}
            </h2>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedCategoryId && (
            <button
              onClick={() => selectCategory(null)}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Xoá bộ lọc
            </button>
          )}
          <button
            className="text-white hover:text-white text-sm font-medium flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => router.push(`/product`)}
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showLoading && loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#525252]/20 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-[#FFD2B2]/30"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#FFD2B2]/30 rounded"></div>
                <div className="h-3 bg-[#FFD2B2]/20 rounded w-3/4"></div>
                <div className="h-3 bg-[#FFD2B2]/20 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <svg
              className="w-5 h-5 text-red-500"
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
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Có lỗi xảy ra</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
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
        <div className="text-center py-16">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-[#FFD2B2] rounded-2xl flex items-center justify-center text-4xl">
              📦
            </div>
          </div>
          <h3 className="text-xl font-semibold text-[#121212] mb-3">
            {selectedCategoryId ? 'Không có sản phẩm trong danh mục này' : 'Chưa có sản phẩm nào'}
          </h3>
          <p className="text-[#525252] mb-6 max-w-md mx-auto">
            {selectedCategoryId
              ? 'Thử chọn danh mục khác hoặc quay lại sau để khám phá thêm sản phẩm!'
              : 'Quay lại sau để khám phá thêm nhiều món đồ cũ thú vị!'}
          </p>
          {selectedCategoryId && (
            <button
              onClick={() => selectCategory(null)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Xem tất cả sản phẩm
            </button>
          )}
        </div>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#FDFEF9]">
      <div className="w-full space-y-8 mb-12">
        <div className="rounded-xl overflow-hidden shadow-lg mx-4 sm:mx-6">
          <CarouselComponent />
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Package className="w-5 h-5" />,
                count: homeStats?.totalProducts,
                label: 'Sản phẩm',
              },
              {
                icon: <Users className="w-5 h-5" />,
                count: homeStats?.totalUsers,
                label: 'Người dùng',
              },
              {
                icon: <ShoppingCart className="w-5 h-5" />,
                count: homeStats?.totalSoldProducts,
                label: 'Sản phẩm đã bán',
              },
              {
                icon: <Smile className="w-5 h-5" />,
                count: homeStats?.totaOrders,
                label: 'Đơn hàng',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl border border-orange-200 text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">{stat.icon}</div>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.count}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto px-4 sm:px-6">
          {categoriesLoading ? (
            <div className="bg-white py-6 px-8 rounded-xl shadow-md border border-orange-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Grid3X3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Danh mục sản phẩm
                    </h2>
                    <p className="text-sm text-gray-600">Khám phá theo từng danh mục</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="whitespace-nowrap bg-orange-100 h-10 w-24 rounded-full animate-pulse flex-shrink-0"
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <CategorySelector
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategoryAction={handleSelectCategory}
            />
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-12">
        <ProductSection
          title="Sản phẩm bán chạy"
          subtitle="Những sản phẩm được bán nhiều nhất"
          icon={<TrendingUp className="w-6 h-6" />}
          items={bestSellerProducts}
          showLoading={true}
        />
        <ProductSection
          title="Mới đăng gần đây"
          subtitle="Cập nhật liên tục từ cộng đồng"
          items={products}
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 mt-16 border-t border-orange-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Sparkles className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Cách hoạt động</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Mua bán đồ cũ đơn giản, an toàn và hiệu quả chỉ với 3 bước
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '1',
                title: 'Đăng đồ bạn muốn bán',
                description: 'Chụp ảnh đẹp, mô tả chi tiết và đăng tin miễn phí trong vài phút.',
                icon: <Upload className="w-8 h-8" />,
                color: 'bg-blue-100 text-blue-600',
                bgColor: 'bg-blue-50',
              },
              {
                step: '2',
                title: 'Tìm đồ cũ yêu thích',
                description: 'Duyệt qua hàng ngàn món đồ cũ chất lượng được kiểm duyệt kỹ lưỡng.',
                icon: <Search className="w-8 h-8" />,
                color: 'bg-green-100 text-green-600',
                bgColor: 'bg-green-50',
              },
              {
                step: '3',
                title: 'Liên hệ & giao dịch',
                description: 'Chat trực tiếp với người bán để thỏa thuận giá cả và giao nhận.',
                icon: <MessageCircle className="w-8 h-8" />,
                color: 'bg-orange-100 text-orange-600',
                bgColor: 'bg-orange-50',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${item.bgColor} border border-orange-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className="flex justify-center mb-6">
                  <div
                    className={`p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                </div>
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${item.color} font-bold text-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center gap-3 mx-auto text-lg">
              Bắt đầu ngay
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
