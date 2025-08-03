'use client';

import CarouselComponent from '@/components/Carousel';
import ProductCard from '@/components/product/ProductCard';
import { useProductHome } from '@/hooks/use-product-home';
import { HomeStats, productApi, TProduct } from '@/services/product.api';
import {
  ChevronRight,
  Clock,
  Filter,
  Grid3X3,
  MessageCircle,
  Package,
  Search,
  ShoppingCart,
  Smile,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProductList } from '@/hooks/use-product-list';
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
  const router = useRouter();
    const {

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

  const [productsBestSellers, setProducts] = useState<TProduct[]>([]);
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null);
  useEffect(() => {
    const fetching = async () => {
      const homeStatsResponse = await productApi.getHomeStats();
      console.log(homeStatsResponse);
      if (homeStatsResponse) {
        setHomeStats(homeStatsResponse);
      }
      const response = await productApi.getproductBestSellers();
      if (response) {
        setProducts(response);
      }
    };
    fetching();
  }, []);

const handleSelectCategory = (categoryId: string | null) => {
  if (categoryId) {
    handleSelectedFilterChange('categories', [categoryId]);
  }
  router.push('/product');
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
    <section className="bg-white p-6 sm:p-8 rounded-xl border border-[#525252]/20 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FFD2B2] rounded-lg text-[#121212]">{icon}</div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#121212] flex items-center gap-2">
              {title}
              {title === 'Được mua nhiều' && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                  HOT
                </span>
              )}
              {selectedCategoryId && (
                <span className="bg-[#FFD2B2] text-[#121212] px-3 py-1 rounded-full text-xs font-medium border border-[#525252]/20">
                  {categories.find((cat) => cat.id === selectedCategoryId)?.name || 'Đã lọc'}
                </span>
              )}
            </h2>
            {subtitle && <p className="text-sm text-[#525252] mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedCategoryId && (
            <button
              onClick={() => selectCategory(null)}
              className="text-[#525252] hover:text-[#121212] text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#FDFEF9] transition-all duration-200"
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
          <button className="text-[#121212] hover:text-[#525252] text-sm font-medium flex items-center gap-2 px-4 py-2 bg-[#FFD2B2] hover:bg-[#FFBB99] rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
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
              : 'Hãy quay lại sau để xem thêm những món đồ cũ thú vị!'}
          </p>
          {selectedCategoryId && (
            <button
              onClick={() => selectCategory(null)}
              className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
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
                className="bg-white p-4 rounded-xl border border-[#525252]/20 text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-[#FFD2B2] rounded-lg text-[#121212]">{stat.icon}</div>
                </div>
                <div className="text-2xl font-bold text-[#121212] mb-1">{stat.count}</div>
                <div className="text-sm text-[#525252]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white py-6 px-6 sm:px-8 rounded-xl shadow-md border border-[#525252]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFD2B2] rounded-lg">
                  <Grid3X3 className="w-5 h-5 text-[#121212]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#121212]">Danh mục sản phẩm</h2>
                  <p className="text-sm text-[#525252]">Khám phá theo từng danh mục</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#525252]" />
                <span className="text-sm text-[#525252]">Lọc</span>
              </div>
            </div>

            {categoriesLoading ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="whitespace-nowrap bg-[#FFD2B2]/30 h-10 w-24 rounded-full animate-pulse flex-shrink-0"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#FFD2B2] scrollbar-track-[#FDFEF9]">
                <button
                  onClick={() => handleSelectCategory}
                  className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium flex-shrink-0 ${selectedCategoryId === null
                      ? 'bg-[#FFD2B2] text-[#121212] shadow-md border border-[#525252]/20'
                      : 'bg-[#FDFEF9] text-[#525252] hover:bg-[#FFD2B2]/50 border border-[#525252]/20'
                    }`}
                >
                  Tất cả
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleSelectCategory(category.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium flex-shrink-0 ${selectedCategoryId === category.id
                        ? 'bg-[#FFD2B2] text-[#121212] shadow-md border border-[#525252]/20'
                        : 'bg-[#FDFEF9] text-[#525252] hover:bg-[#FFD2B2]/50 border border-[#525252]/20'
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

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-12">
        <ProductSection
          title="Được mua nhiều"
          subtitle="Những sản phẩm hot nhất hiện tại"
          icon={<TrendingUp className="w-6 h-6" />}
          items={productsBestSellers}
          showLoading={true}
        />
        <ProductSection
          title="Mới đăng gần đây"
          subtitle="Cập nhật liên tục từ cộng đồng"
          items={products}
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 mt-16 border-t border-[#525252]/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-[#FFD2B2] rounded-xl">
                <Sparkles className="w-8 h-8 text-[#121212]" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#121212] mb-4">Cách hoạt động</h2>
            <p className="text-[#525252] text-lg max-w-2xl mx-auto">
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
                color: 'bg-[#FFD2B2] text-[#121212]',
                bgColor: 'bg-[#FDFEF9]',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${item.bgColor} border border-[#525252]/20 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group`}
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
                <h3 className="font-bold text-xl text-[#121212] mb-4">{item.title}</h3>
                <p className="text-[#525252] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center gap-3 mx-auto text-lg">
              Bắt đầu ngay
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#FFD2B2] to-[#FFBB99] py-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Star className="w-8 h-8 text-[#121212]" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#121212] mb-4">Đừng bỏ lỡ cơ hội</h2>
          <p className="text-[#121212]/80 text-lg mb-8 max-w-2xl mx-auto">
            Đăng ký nhận thông báo về những món đồ cũ độc đáo và ưu đãi đặc biệt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg border border-[#525252]/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-[#121212] hover:bg-[#525252] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
