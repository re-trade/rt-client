'use client';

import Toast from '@/components/toast/Toast';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useProductDetail } from '@/hooks/use-product-detail';
import { reviewApi } from '@/services/product-review.api';
import BuyNowDialog from '@components/common/BuyNowDialog';
import ReviewsList from '@components/common/review/ListReview';
import ImageGallery from '@components/gallery/ImageGallery';
import ContentSkeleton from '@components/product/ProductContentSkeleton';
import { ProductHistoryList } from '@components/product/ProductHistoryList';
import ProductImageSkeleton from '@components/product/ProductImageSkeleton';
import ProductInfoSkeleton from '@components/product/ProductInfoSkeleton';
import RelatedProducts from '@components/related-product/RelatedProduct';
import ShareButton from '@components/share/ShareButton';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  MdAdd,
  MdAddShoppingCart,
  MdFavoriteBorder,
  MdRemove,
  MdSecurity,
  MdStar,
  MdVerified,
  MdWarning,
} from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { auth, sellerProfile } = useAuth();
  const { addToCart } = useCart();
  const { showToast, messages } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [stockWarning, setStockWarning] = useState(false);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>(
    'description',
  );

  const { id } = params;
  const { productDetail, listImg, loading, relatedProducts, productHistories } =
    useProductDetail(id);

  const handleAddToCart = async () => {
    if (!productDetail) return;

    setIsAddingToCart(true);
    try {
      await addToCart(productDetail.id, quantity);
      showToast('Đã thêm vào giỏ hàng thành công!', 'success');
    } catch (_) {
      showToast('Không thể thêm vào giỏ hàng.', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };
  const showButtonBuy = () => {
    if (sellerProfile && sellerProfile.verified) {
      if (productDetail && productDetail.sellerId === sellerProfile.id) {
        return false;
      }
    }
    return true;
  };
  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      if (productDetail && quantity < productDetail.quantity) {
        setQuantity((prev) => prev + 1);
        if (quantity + 1 >= productDetail.quantity) {
          setStockWarning(true);
        }
      }
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setStockWarning(false);
    }
  };

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    setGalleryIndex((prev) => (prev + 1) % listImg.length);
  };

  const prevImage = () => {
    setGalleryIndex((prev) => (prev - 1 + listImg.length) % listImg.length);
  };

  const handleGalleryIndexChange = (index: number) => {
    setGalleryIndex(index);
  };

  useEffect(() => {
    const fetching = async () => {
      if (productDetail) {
        try {
          const response = await reviewApi.getTotalReviews(productDetail.id);
          setTotalReviews(response);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };
    fetching();
  }, [productDetail]);

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
      setStockWarning(false);
    } else if (productDetail && value > productDetail.quantity) {
      setQuantity(productDetail.quantity);
      setStockWarning(true);
    } else {
      setQuantity(value);
      setStockWarning(productDetail ? value >= productDetail.quantity * 0.8 : false);
    }
  };

  if (!productDetail || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex space-x-2 text-sm">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-20" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-16" />
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProductImageSkeleton />
            <ProductInfoSkeleton />
          </div>

          <ContentSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
      <Toast messages={messages} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 flex-wrap text-sm">
            {productDetail.categories?.map((cat, index: number) => (
              <li key={index} className="flex items-center">
                {index !== 0 ? (
                  <span className="mx-2 text-gray-400" style={{ color: '#9ca3af' }}>
                    /
                  </span>
                ) : (
                  <></>
                )}
                <a
                  href={`/category/${cat.id}`}
                  className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
                  style={{ color: '#6b7280' }}
                >
                  {cat.name}
                </a>
              </li>
            ))}
            <li className="flex items-center">
              <span className="mx-2 text-gray-400" style={{ color: '#9ca3af' }}>
                /
              </span>
              <span
                className="text-orange-600 font-semibold truncate max-w-[200px]"
                style={{ color: '#ea580c' }}
              >
                {productDetail.name}
              </span>
            </li>
          </ol>
        </nav>

        {!productDetail.verified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 border-t border-b border-orange-300 shadow-md overflow-hidden relative"
          >
            <div className="py-3 relative">
              <motion.div
                animate={{ x: [1000, -1000] }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="whitespace-nowrap flex items-center text-white font-semibold"
              >
                <span className="flex items-center space-x-3 mx-8">
                  <MdWarning className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                  <span className="text-lg">CẢNH BÁO: Sản phẩm chưa được xác minh</span>
                </span>
                <span className="text-orange-200 mx-4">•</span>
                <span className="flex items-center space-x-3 mx-8">
                  <MdSecurity className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                  <span className="text-lg">Vui lòng kiểm tra kỹ trước khi mua</span>
                </span>
                <span className="text-orange-200 mx-4">•</span>
                <span className="flex items-center space-x-3 mx-8">
                  <MdWarning className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                  <span className="text-lg">CẢNH BÁO: Sản phẩm chưa được xác minh</span>
                </span>
                <span className="text-orange-200 mx-4">•</span>
                <span className="flex items-center space-x-3 mx-8">
                  <MdSecurity className="h-5 w-5 text-yellow-200 flex-shrink-0" />
                  <span className="text-lg">Vui lòng kiểm tra kỹ trước khi mua</span>
                </span>
                <span className="text-orange-200 mx-4">•</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <button
              onClick={() => openGallery(selectedImage)}
              className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-orange-100 bg-white shadow-lg group cursor-pointer"
            >
              <Image
                src={listImg[selectedImage] || '/image_login.jpg'}
                alt={productDetail.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              {productDetail.verified && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-md">
                  <MdVerified size={16} />
                  Đã xác minh
                </div>
              )}
              {productDetail.condition === 'NEW' && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm shadow-md">
                  Mới
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Nhấn để phóng to
              </div>
            </button>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
              {listImg.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    openGallery(index);
                  }}
                  className={`relative min-w-[100px] h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-md
                    ${
                      selectedImage === index
                        ? 'border-orange-500 ring-2 ring-orange-200 shadow-md'
                        : 'border-orange-200 hover:border-orange-300'
                    }`}
                >
                  <Image src={img} alt={`Ảnh ${index + 1}`} fill className="object-cover" />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-orange-500/10 border border-orange-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1
                  className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight flex-1 pr-4"
                  style={{ color: '#111827' }}
                >
                  {productDetail.name}
                </h1>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="p-3 rounded-full border border-orange-200 hover:bg-orange-50 transition-colors hover:scale-105">
                    <MdFavoriteBorder size={20} className="text-orange-600" />
                  </button>
                  <ShareButton
                    productName={productDetail.name}
                    productDescription={productDetail.shortDescription}
                    productImage={listImg[0]}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span
                  className="flex items-center gap-1 text-gray-600"
                  style={{ color: '#6b7280' }}
                >
                  <MdStar className="text-yellow-400" size={16} />
                  {productDetail.avgVote} ({totalReviews} đánh giá)
                </span>
                <span className="text-gray-400" style={{ color: '#9ca3af' }}>
                  |
                </span>
                <span className="text-gray-600" style={{ color: '#6b7280' }}>
                  Còn {productDetail.quantity} sản phẩm
                </span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg" style={{ color: '#ffffff' }}>
                    {productDetail.sellerShopName?.charAt(0) || 'S'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800" style={{ color: '#1f2937' }}>
                    {productDetail.sellerShopName}
                  </p>
                  <div className="flex items-center gap-1">
                    <MdStar className="text-yellow-500" size={16} />
                    <span className="text-sm text-gray-600" style={{ color: '#6b7280' }}>
                      {sellerProfile?.avgVote || 0} (256 đánh giá)
                    </span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
                  style={{ color: '#1f2937' }}
                  onClick={() => router.push(`/seller/${productDetail.sellerId}`)}
                >
                  Xem người bán
                </button>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed" style={{ color: '#374151' }}>
                {productDetail.shortDescription || 'Không có mô tả ngắn.'}
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-4xl font-bold text-orange-600">
                    {productDetail.currentPrice?.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600" style={{ color: '#6b7280' }}>
                    Tình trạng:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      productDetail.quantity > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                    style={{
                      color: productDetail.quantity > 0 ? '#166534' : '#991b1b',
                      backgroundColor: productDetail.quantity > 0 ? '#dcfce7' : '#fee2e2',
                    }}
                  >
                    {productDetail.quantity > 0
                      ? `Còn ${productDetail.quantity} sản phẩm`
                      : 'Hết hàng'}
                  </span>
                </div>

                {stockWarning && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <MdWarning size={16} />
                    <span style={{ color: '#d97706' }}>
                      Sắp hết hàng! Chỉ còn {productDetail.quantity} sản phẩm.
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  {auth ? (
                    <div className="flex items-center">
                      {showButtonBuy() ? (
                        <div>
                          <span className="text-sm text-gray-600 mr-3" style={{ color: '#6b7280' }}>
                            Số lượng:
                          </span>
                          <div className="flex items-center border border-orange-200 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(false)}
                              className="p-2 hover:bg-orange-50 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={quantity <= 1}
                            >
                              <MdRemove size={16} className="text-gray-600" />
                            </button>
                            <input
                              type="number"
                              value={quantity}
                              onChange={handleQuantityInput}
                              className="w-16 text-center border-none outline-none bg-transparent text-gray-600"
                              min="1"
                              max={productDetail.quantity}
                            />
                            <button
                              onClick={() => handleQuantityChange(true)}
                              className="p-2 hover:bg-orange-50 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={quantity >= productDetail.quantity}
                            >
                              <MdAdd size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 mr-3" style={{ color: '#6b7280' }}>
                          Số lượng: {productDetail.quantity}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {auth ? (
                    <div className="flex gap-3 flex-1">
                      {showButtonBuy() ? (
                        <div className="flex gap-3 flex-1">
                          {/* Nút thêm vào giỏ */}
                          <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || productDetail.quantity === 0}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isAddingToCart ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Đang thêm...
                              </>
                            ) : (
                              <>
                                <MdAddShoppingCart size={20} />
                                Thêm vào giỏ
                              </>
                            )}
                          </button>

                          {/* Nút mua ngay */}
                          <button
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-colors"
                            onClick={() => setShowBuyNow(true)}
                            disabled={productDetail.quantity === 0}
                          >
                            Mua ngay
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <p className="text-gray-700 font-medium">🌟 Đây là sản phẩm của bạn</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="text-gray-600 mb-4">
                        <MdSecurity size={32} className="mx-auto mb-2 text-gray-400" />
                        <p className="font-semibold">Vui lòng đăng nhập để mua hàng</p>
                        <p className="text-sm">
                          Đăng nhập để thêm sản phẩm vào giỏ hàng và mua ngay
                        </p>
                      </div>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Đăng nhập ngay
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <BuyNowDialog
              isOpen={showBuyNow}
              onClose={() => setShowBuyNow(false)}
              product={productDetail}
              initialQuantity={2}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 mb-12">
          <div className="border-b border-orange-100">
            <nav className="flex">
              {[
                { key: 'description', label: 'Mô tả sản phẩm' },
                { key: 'specifications', label: 'Thông số kỹ thuật' },
                { key: 'reviews', label: `Đánh giá (${totalReviews})` },
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
                  style={{
                    color: activeTab === tab.key ? '#ea580c' : '#6b7280',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose prose-orange max-w-none">
                <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ color: '#1f2937' }}>
                  Mô tả chi tiết
                </h3>
                <div className="text-gray-700 leading-relaxed markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-gray-800 mt-5 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                      em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                      code: ({ children }) => (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-orange-300 pl-4 italic text-gray-600 my-4">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-orange-600 hover:text-orange-700 underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border border-gray-200 rounded-lg">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-gray-200">{children}</tbody>
                      ),
                      tr: ({ children }) => <tr className="hover:bg-gray-50">{children}</tr>,
                      th: ({ children }) => (
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-2 text-sm text-gray-700 border-b">{children}</td>
                      ),
                    }}
                  >
                    {productDetail.description || 'Chưa có mô tả chi tiết.'}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800" style={{ color: '#1f2937' }}>
                  Thông số kỹ thuật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Thương hiệu:
                      </span>
                      <span className="text-gray-800" style={{ color: '#1f2937' }}>
                        {productDetail.brand || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Model:
                      </span>
                      <span className="text-gray-800" style={{ color: '#1f2937' }}>
                        {productDetail.model || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Tình trạng:
                      </span>
                      <span className="text-gray-800" style={{ color: '#1f2937' }}>
                        {productDetail.condition === 'NEW' ? 'Mới' : 'Đã sử dụng'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Bảo hành đến:
                      </span>
                      <span className="text-gray-800" style={{ color: '#1f2937' }}>
                        {productDetail.warrantyExpiryDate
                          ? new Date(productDetail.warrantyExpiryDate).toLocaleDateString('vi-VN')
                          : 'Không có'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Xác minh:
                      </span>
                      <span className="text-gray-800" style={{ color: '#1f2937' }}>
                        {productDetail.verified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Danh mục:
                      </span>
                      <span className="text-gray-800">
                        {productDetail.categories?.length > 0
                          ? productDetail.categories.map((cat, index) => {
                              const colorClasses = [
                                'text-orange-500 border-orange-500',
                                'text-blue-500 border-blue-500',
                                'text-yellow-500 border-yellow-500',
                                'text-teal-500 border-teal-500',
                                'text-red-500 border-red-500',
                              ];
                              const colorClass = colorClasses[index % colorClasses.length];
                              return (
                                <span
                                  key={cat.name}
                                  className={`border ${colorClass} px-2 py-1 rounded-md mr-2 text-sm font-medium`}
                                >
                                  {cat.name}
                                </span>
                              );
                            })
                          : 'Không có'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Tags:
                      </span>
                      <span className="text-gray-800">
                        {productDetail.tags?.length > 0
                          ? productDetail.tags.map((tag, index) => {
                              const colorClasses = [
                                'text-orange-500 border-orange-500',
                                'text-blue-500 border-blue-500',
                                'text-yellow-500 border-yellow-500',
                                'text-teal-500 border-teal-500',
                                'text-red-500 border-red-500',
                              ];
                              const colorClass = colorClasses[index % colorClasses.length];
                              return (
                                <span
                                  key={tag}
                                  className={`border ${colorClass} px-2 py-1 rounded-md mr-2 text-sm font-medium`}
                                >
                                  {tag}
                                </span>
                              );
                            })
                          : 'Không có'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Ngày tạo:
                      </span>
                      <span className="text-gray-800" style={{ color: '#1f2937' }}>
                        {new Date(productDetail.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-600" style={{ color: '#6b7280' }}>
                        Cập nhật:
                      </span>
                      <span className="text-gray-800" style={{ color: '#1f2937' }}>
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
                  <ReviewsList productId={productDetail.id} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <ProductHistoryList history={productHistories} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-orange-100">
          <div className="p-6 border-b border-orange-100">
            <h2 className="text-2xl font-bold text-gray-800" style={{ color: '#1f2937' }}>
              Sản phẩm tương tự
            </h2>
            <p className="text-gray-600 mt-1" style={{ color: '#6b7280' }}>
              Khám phá những sản phẩm liên quan khác
            </p>
          </div>
          <div className="p-6">
            <RelatedProducts products={relatedProducts} />
          </div>
        </div>
      </div>

      <ImageGallery
        images={listImg}
        currentIndex={galleryIndex}
        isOpen={showGallery}
        onClose={closeGallery}
        onNext={nextImage}
        onPrevious={prevImage}
        onIndexChange={handleGalleryIndexChange}
        productName={productDetail.name}
      />
    </div>
  );
}

export default ProductDetail;
