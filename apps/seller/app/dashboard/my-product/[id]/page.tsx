'use client';

import RetradeModal from '@/components/retrade-products/RetradeModal';
import RetradeProductDetailError from '@/components/retrade-products/RetradeProductDetailError';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useProductHistory from '@/hooks/use-product-history';
import useRetradeProductDetail from '@/hooks/use-retrade-product-detail';
import { RetradeOrderItem } from '@/service/product.api';
import { retradeApi, RetradeRequest } from '@/service/retrade.api';
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  History,
  Info,
  Package,
  Repeat,
  ShoppingBag,
  Tag,
  User,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { productDetail, refreshProductDetail, isLoading, error } =
    useRetradeProductDetail(productId);

  const { productHistory, isLoading: historyLoading } = useProductHistory(productId);

  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'history'>('details');

  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [selectedOrderItem, setSelectedOrderItem] = useState<RetradeOrderItem | null>(null);
  const [maxRetradeQuantity, setMaxRetradeQuantity] = useState<number>(0);

  const [isRetradeModalOpen, setIsRetradeModalOpen] = useState(false);

  useEffect(() => {
    if (productDetail) {
      const retradeableItem = productDetail.orderItemRetrades?.find(
        (item: RetradeOrderItem) => item.retradeQuantity && item.retradeQuantity > 0,
      );

      if (retradeableItem) {
        setSelectedOrderItem(retradeableItem);
        setMaxRetradeQuantity(retradeableItem.retradeQuantity || 0);
      }
    }
  }, [productDetail]);

  function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  function getConditionLabel(condition: string) {
    switch (condition?.toLowerCase()) {
      case 'new':
        return {
          label: 'Mới 100%',
          color: 'bg-green-50 border-green-200 text-green-700',
        };
      case 'like_new':
        return {
          label: 'Như mới',
          color: 'bg-blue-50 border-blue-200 text-blue-700',
        };
      case 'very_good':
        return {
          label: 'Rất tốt',
          color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        };
      case 'good':
        return {
          label: 'Tốt',
          color: 'bg-orange-50 border-orange-200 text-orange-700',
        };
      case 'acceptable':
        return {
          label: 'Chấp nhận được',
          color: 'bg-amber-50 border-amber-200 text-amber-700',
        };
      default:
        return {
          label: 'Không xác định',
          color: 'bg-gray-50 border-gray-200 text-gray-700',
        };
    }
  }

  async function handleRetradeSubmit(request: RetradeRequest) {
    try {
      await retradeApi.createRetrade(request);
      return Promise.resolve();
    } catch (err: any) {
      return Promise.reject(err);
    }
  }
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-36" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <Skeleton className="h-[500px] w-full rounded-2xl mb-4" />
              <div className="flex gap-2 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-24 rounded-xl flex-shrink-0" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>

          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !productDetail) {
    return <RetradeProductDetailError error={error} refreshProductDetail={refreshProductDetail} />;
  }

  const conditionInfo = getConditionLabel(productDetail.condition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-end mb-6">
          <Button
            onClick={refreshProductDetail}
            variant="outline"
            className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Repeat className="h-4 w-4" />
            Làm mới
          </Button>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 flex-wrap text-sm">
            <li>
              <a
                href="/dashboard"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Dashboard
              </a>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link
                href="/dashboard/my-product"
                className={'text-gray-600 hover:text-orange-600 transition-colors'}
              >
                Sản phẩm của tôi
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-orange-600 font-semibold truncate max-w-[200px]">
                {productDetail.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-orange-100 bg-white shadow-lg">
              {productDetail.productImages && productDetail.productImages.length > 0 ? (
                <>
                  <Image
                    src={productDetail.productImages[selectedImage] || ''}
                    alt={productDetail.name}
                    fill
                    className="object-contain"
                    onLoad={() => setIsImageLoading(false)}
                    priority
                  />
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                  )}
                  {productDetail.productImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full"
                        onClick={() =>
                          setSelectedImage(
                            (prev) =>
                              (prev - 1 + productDetail.productImages.length) %
                              productDetail.productImages.length,
                          )
                        }
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full"
                        onClick={() =>
                          setSelectedImage(
                            (prev) => (prev + 1) % productDetail.productImages.length,
                          )
                        }
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className={`${conditionInfo.color} px-3 py-1 text-sm`}>
                      {conditionInfo.label}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không có hình ảnh sản phẩm</p>
                  </div>
                </div>
              )}
            </div>

            {productDetail.productImages && productDetail.productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
                {productDetail.productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative min-w-[100px] h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-md
                      ${
                        selectedImage === index
                          ? 'border-orange-500 ring-2 ring-orange-200 shadow-md'
                          : 'border-orange-200 hover:border-orange-300'
                      }`}
                  >
                    <Image src={image} alt={`Ảnh ${index + 1}`} fill className="object-cover" />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-orange-500/10 border border-orange-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productDetail.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-700">Mã sản phẩm:</span>
                  <span className="font-medium">
                    {productDetail.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-700">Ngày tạo:</span>
                  <span className="font-medium">{formatDate(productDetail.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 shadow-sm">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Giá sản phẩm</p>
                  <span className="text-3xl font-bold text-orange-600">
                    {formatPrice(productDetail.currentPrice)}
                  </span>
                </div>
                {maxRetradeQuantity > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Có thể bán lại</p>
                    <span className="text-xl font-semibold text-green-600">
                      {maxRetradeQuantity} sản phẩm
                    </span>
                  </div>
                )}
              </div>

              {productDetail.shortDescription && (
                <div className="my-4">
                  <p className="text-gray-700 bg-orange-50/50 p-3 rounded-lg border border-orange-100 text-sm">
                    {productDetail.shortDescription}
                  </p>
                </div>
              )}

              <Button
                onClick={() => setIsRetradeModalOpen(true)}
                disabled={!selectedOrderItem}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 text-base mt-4 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Repeat className="w-5 h-5 mr-2" />
                Đăng ký bán lại sản phẩm
              </Button>
            </div>

            {productDetail.orderItemRetrades && productDetail.orderItemRetrades.length > 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-sm">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  Đơn hàng có thể bán lại
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {productDetail.orderItemRetrades.map((item: RetradeOrderItem) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedOrderItem(item);
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        selectedOrderItem?.id === item.id
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-800">
                            Đơn hàng #{item.id.substring(0, 8)}
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 border-orange-200 text-orange-700"
                          >
                            {item.retradeQuantity} sản phẩm
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Người bán: {item.sellerName || 'Không xác định'}
                        </p>
                      </div>
                      {selectedOrderItem?.id === item.id && (
                        <div className="bg-orange-500 text-white p-1 rounded-full flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-sm text-center">
                <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Không có đơn hàng</h3>
                <p className="text-gray-600 mb-4">
                  Bạn không có đơn hàng nào có thể bán lại sản phẩm này.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Về trang dashboard
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 mb-12">
            <div className="border-b border-orange-100">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === 'details'
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                  style={{
                    color: activeTab === 'details' ? '#ea580c' : '#6b7280',
                  }}
                >
                  Thông tin chi tiết
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === 'specs'
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                  style={{
                    color: activeTab === 'specs' ? '#ea580c' : '#6b7280',
                  }}
                >
                  Thông số kỹ thuật
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === 'history'
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                  style={{
                    color: activeTab === 'history' ? '#ea580c' : '#6b7280',
                  }}
                >
                  Lịch sử sở hữu
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Info className="w-6 h-6 text-orange-500" />
                    Thông tin chi tiết
                  </h2>

                  {productDetail.description ? (
                    <div className="max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-6 rounded-lg border border-orange-100">
                        {productDetail.description}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-12 h-12 text-orange-300 mx-auto mb-2" />
                      <p className="text-gray-500">Sản phẩm chưa có thông tin mô tả chi tiết</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'specs' && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-orange-500" />
                    Thông số kỹ thuật
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Thương hiệu:</div>
                      <div className="col-span-2">{productDetail.brand || 'Apacer'}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Model:</div>
                      <div className="col-span-2">{productDetail.model || 'SMG-500'}</div>
                    </div>

                    {/* Danh mục */}
                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Danh mục:</div>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {productDetail.categories &&
                            productDetail.categories.slice(0, 3).map((category) => (
                              <Badge
                                key={category.id}
                                variant="secondary"
                                className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 text-sm"
                              >
                                {category.name}
                              </Badge>
                            ))}
                          {productDetail.categories && productDetail.categories.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-50 text-gray-700 border-gray-200 px-3 py-1 text-sm"
                            >
                              +{productDetail.categories.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Tags:</div>
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {productDetail.tags &&
                            productDetail.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border-orange-200 bg-orange-50 text-orange-700"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          {productDetail.tags && productDetail.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="border-gray-200 bg-gray-50 text-gray-700"
                            >
                              +{productDetail.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Tình trạng:</div>
                      <div className="col-span-2">{conditionInfo.label || 'Đã sử dụng'}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Ngày tạo:</div>
                      <div className="col-span-2">
                        {formatDate(productDetail.createdAt) || '22/8/2025'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Bảo hành đến:</div>
                      <div className="col-span-2">
                        {productDetail.warrantyExpiryDate
                          ? formatDate(productDetail.warrantyExpiryDate)
                          : '25/8/2025'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 border-b border-orange-100 pb-4">
                      <div className="font-medium text-gray-700">Cập nhật:</div>
                      <div className="col-span-2">
                        {formatDate(productDetail.updatedAt) || '22/8/2025'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pb-4">
                      <div className="font-medium text-gray-700">Xác minh:</div>
                      <div className="col-span-2">
                        {productDetail.condition === 'VERIFIED' ? 'Đã xác minh' : 'Chưa xác minh'}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'history' && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <History className="w-6 h-6 text-orange-500" />
                    Lịch sử sở hữu
                  </h2>

                  {historyLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
                    </div>
                  ) : !productHistory || productHistory.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                      <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Chưa có lịch sử sở hữu</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Sản phẩm này chưa có thông tin về những người đã từng sở hữu
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto pr-2">
                      <div className="relative">
                        <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-orange-200"></div>
                        {productHistory.map((item, index) => (
                          <div key={`${item.ownerId}-${index}`} className="relative pl-16 pb-10">
                            <div className="absolute left-4 top-2 w-5 h-5 rounded-full bg-orange-500 border-4 border-orange-100"></div>
                            <div className="bg-white rounded-xl border border-orange-100 p-5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300">
                              <div className="flex items-start gap-4">
                                <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-orange-100">
                                  <Image
                                    src={item.productThumbnail || '/placeholder.jpg'}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-orange-600">
                                    {formatDate(new Date().toString())}
                                  </p>
                                  <h3 className="font-semibold text-gray-800 text-lg mt-1">
                                    {item.productName}
                                  </h3>
                                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                    {item.productDescription}
                                  </p>

                                  <div className="flex items-center mt-3 gap-2">
                                    <div className="relative flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-orange-100">
                                      <Image
                                        src={item.ownerAvatarUrl || '/user-placeholder.jpg'}
                                        alt={item.ownerName}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="bg-orange-50 text-orange-700 border-orange-200"
                                    >
                                      <User className="w-3 h-3 mr-1" />
                                      {item.ownerName}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <RetradeModal
        isOpen={isRetradeModalOpen}
        onClose={() => setIsRetradeModalOpen(false)}
        onSubmit={handleRetradeSubmit}
        productDetail={productDetail}
        selectedOrderItem={selectedOrderItem}
        maxRetradeQuantity={maxRetradeQuantity}
        refreshProductDetail={refreshProductDetail}
      />
    </div>
  );
}
