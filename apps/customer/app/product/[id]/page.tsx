'use client';

import RelatedProducts from '@/components/related-product/page';
import { useCart } from '@/context/CartContext';
import { productApi, TProduct } from '@/services/product.api';
import Chart from '@components/chart/chart';
import { IconCheck } from '@tabler/icons-react';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import {
  MdAddShoppingCart,
  MdAssignment,
  MdFavoriteBorder,
  MdLocalShipping,
  MdSecurity,
  MdShare,
  MdStar,
  MdVerified,
} from 'react-icons/md';

interface Product {
  name: string;
  price: number;
  discountPrice: number;
  description: string;
  images: string[];
  shopName: string;
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [productDetail, setProductDetail] = useState<TProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>(
    'description',
  );

  const { id } = use(params);
  const [listImg, setListImg] = useState<string[]>([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const product = await productApi.getProduct(id);
        setProductDetail(product);
        setListImg([
          ...(product.thumbnail ? [product.thumbnail] : []),
          ...(product.productImages || []),
        ]);
      } catch (error) {
        // Error fetching product details
      }
    };
    fetchProductDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!productDetail) return;

    setIsAddingToCart(true);
    try {
      await addToCart(productDetail.id, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => prev + 1);
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const calculateDiscount = () => {
    if (!productDetail?.discount || !productDetail?.currentPrice) return 0;
    const discount = typeof productDetail.discount === 'number' ? productDetail.discount : 0;
    return Math.round(((productDetail.currentPrice - discount) / productDetail.currentPrice) * 100);
  };

  if (!productDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-full h-[480px] bg-gray-200 rounded-xl"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <IconCheck size={20} />
          <span>Đã thêm vào giỏ hàng!</span>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>
              <span className="hover:text-orange-600 cursor-pointer">Trang chủ</span>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <span className="text-orange-600 font-medium">{productDetail.name}</span>
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-orange-100 bg-white shadow-lg">
              <Image
                src={listImg[selectedImage] || '/image_login.jpg'}
                alt={productDetail.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
              {productDetail.verified && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <MdVerified size={16} />
                  Đã xác minh
                </div>
              )}
              {calculateDiscount() > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{calculateDiscount()}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
              {listImg.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative min-w-[100px] h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105
                    ${
                      selectedImage === index
                        ? 'border-orange-500 ring-2 ring-orange-200 shadow-md'
                        : 'border-orange-200 hover:border-orange-300'
                    }`}
                >
                  <Image src={img} alt={`Ảnh ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                  {productDetail.name}
                </h1>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-orange-200 hover:bg-orange-50 transition-colors">
                    <MdFavoriteBorder size={20} className="text-orange-600" />
                  </button>
                  <button className="p-2 rounded-full border border-orange-200 hover:bg-orange-50 transition-colors">
                    <MdShare size={20} className="text-orange-600" />
                  </button>
                </div>
              </div>

              {/* Shop Info */}
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {productDetail.sellerShopName?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{productDetail.sellerShopName}</p>
                  <div className="flex items-center gap-1">
                    <MdStar className="text-yellow-500" size={16} />
                    <span className="text-sm text-gray-600">4.8 (256 đánh giá)</span>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 text-lg leading-relaxed">
                {productDetail.shortDescription}
              </p>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-4xl font-bold text-orange-600">
                    {productDetail.currentPrice?.toLocaleString()}₫
                  </span>
                  {(typeof productDetail.discount === 'number' ? productDetail.discount : 0) >
                    0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {(
                          productDetail.currentPrice +
                          (typeof productDetail.discount === 'number' ? productDetail.discount : 0)
                        ).toLocaleString()}
                        ₫
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Tiết kiệm{' '}
                        {(typeof productDetail.discount === 'number'
                          ? productDetail.discount
                          : 0
                        ).toLocaleString()}
                        ₫
                      </span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 bg-orange-500 text-white px-6 py-4 rounded-xl hover:bg-orange-600
                      transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg
                      disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {isAddingToCart ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <MdAddShoppingCart size={24} />
                    )}
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 rounded-xl
                    hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-semibold text-lg
                    shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                <MdLocalShipping className="text-orange-500" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Miễn phí vận chuyển</p>
                  <p className="text-sm text-gray-600">Đơn từ 500k</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                <MdSecurity className="text-orange-500" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Bảo hành 12 tháng</p>
                  <p className="text-sm text-gray-600">Chính hãng</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                <MdAssignment className="text-orange-500" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Đổi trả 7 ngày</p>
                  <p className="text-sm text-gray-600">Miễn phí</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 mb-12">
          {/* Tab Navigation */}
          <div className="border-b border-orange-100">
            <nav className="flex">
              {[
                { key: 'description', label: 'Mô tả sản phẩm' },
                { key: 'specifications', label: 'Thông số kỹ thuật' },
                { key: 'reviews', label: 'Đánh giá (256)' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(tab.key as 'description' | 'specifications' | 'reviews')
                  }
                  className={`px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Mô tả chi tiết</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {productDetail.description || 'Chưa có mô tả chi tiết.'}
                </div>
                {productDetail.keywords?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Từ khóa:</h4>
                    <div className="flex flex-wrap gap-2">
                      {productDetail.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Thương hiệu:</span>
                      <span className="text-gray-800">{productDetail.brand || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Model:</span>
                      <span className="text-gray-800">{productDetail.model || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Tình trạng:</span>
                      <span className="text-gray-800">
                        {productDetail.verified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Ngày tạo:</span>
                      <span className="text-gray-800">
                        {new Date(productDetail.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Cập nhật:</span>
                      <span className="text-gray-800">
                        {new Date(productDetail.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">Đánh giá từ khách hàng</h3>
                <div className="text-center py-12 text-gray-500">
                  <MdStar size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                  <p className="text-sm">Hãy là người đầu tiên đánh giá!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price History Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 mb-12">
          <div className="p-6 border-b border-orange-100">
            <h2 className="text-2xl font-bold text-gray-800">Lịch sử giá</h2>
            <p className="text-gray-600 mt-1">Theo dõi xu hướng giá của sản phẩm</p>
          </div>
          <div className="p-6">
            <div className="h-[300px]">
              <Chart />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
          <div className="p-6 border-b border-orange-100">
            <h2 className="text-2xl font-bold text-gray-800">Sản phẩm tương tự</h2>
            <p className="text-gray-600 mt-1">Khám phá những sản phẩm liên quan khác</p>
          </div>
          <div className="p-6">
            <RelatedProducts />
          </div>
        </div>
      </div>
    </div>
  );
}
