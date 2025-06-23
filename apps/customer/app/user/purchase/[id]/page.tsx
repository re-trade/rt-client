'use client';

import { useOrder } from '@/hooks/use-order';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Receipt,
  Star,
  Truck,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const statusConfig = {
  'Payment Confirmation': {
    label: 'Chờ thanh toán',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="w-5 h-5" />,
    description: 'Đơn hàng đang chờ xác nhận thanh toán',
  },
  'Order Confirmed': {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Đơn hàng đã được xác nhận và đang được xử lý',
  },
  Preparing: {
    label: 'Đang chuẩn bị',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Package className="w-5 h-5" />,
    description: 'Người bán đang chuẩn bị hàng hóa',
  },
  Shipping: {
    label: 'Đang giao',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Truck className="w-5 h-5" />,
    description: 'Đơn hàng đang được vận chuyển',
  },
  Delivered: {
    label: 'Đã giao',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <CheckCircle className="w-5 h-5" />,
    description: 'Đơn hàng đã được giao thành công',
  },
  Cancelled: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <XCircle className="w-5 h-5" />,
    description: 'Đơn hàng đã được hủy',
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { currentOrder, isLoading, error, getOrderById, clearCurrentOrder } = useOrder();
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId);
    }

    return () => {
      clearCurrentOrder();
    };
  }, [orderId, getOrderById, clearCurrentOrder]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const getStatusDisplay = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <Package className="w-5 h-5" />,
        description: 'Trạng thái không xác định',
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFEF9] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 border border-[#525252]/20">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-[#FDFEF9] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 border border-[#525252]/20 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại hoặc đã bị xóa'}</p>
            <Link href="/user/purchase">
              <button className="bg-[#FFD2B2] hover:bg-[#FFBB99] text-[#121212] px-6 py-3 rounded-lg transition-all duration-200 font-medium">
                Quay lại danh sách đơn hàng
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(currentOrder.orderStatus);
  const totalItems = currentOrder.items.length;
  const totalValue = currentOrder.grandPrice;

  return (
    <div className="min-h-screen bg-[#FDFEF9] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-[#525252]/20 overflow-hidden">
          <div className="bg-[#FFD2B2] p-6 text-[#121212]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/user/purchase">
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-[#121212] opacity-80">#{orderId.slice(0, 8)}...</p>
                    <button
                      onClick={handleCopyOrderId}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      title="Sao chép mã đơn hàng"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedOrderId && (
                      <span className="text-xs text-green-700 font-medium">Đã sao chép!</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border bg-white/20 text-[#121212] border-[#121212]/20`}
                >
                  {statusDisplay.icon}
                  <span>{statusDisplay.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div
              className={`p-3 rounded-full ${statusDisplay.color.replace('border-', 'bg-').replace('text-', 'text-white ').split(' ')[0]} text-white`}
            >
              {statusDisplay.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{statusDisplay.label}</h3>
              <p className="text-sm text-gray-600">{statusDisplay.description}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <Receipt className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng giá trị</p>
                <p className="text-xl font-bold text-gray-800">{formatPrice(totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày đặt</p>
                <p className="text-sm font-bold text-gray-800">
                  {formatDate(currentOrder.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin người bán</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              {currentOrder.sellerAvatarUrl ? (
                <Image
                  src={currentOrder.sellerAvatarUrl}
                  alt={currentOrder.sellerName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{currentOrder.sellerName}</h3>
              <p className="text-sm text-gray-600">ID: {currentOrder.sellerId.slice(0, 8)}...</p>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Nhắn tin</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <User className="w-4 h-4" />
                <span>Xem shop</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Sản phẩm đã đặt</h2>
          <div className="space-y-4">
            {currentOrder.items.map((item, index) => (
              <div
                key={item.itemId}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.itemThumbnail ? (
                    <Image
                      src={item.itemThumbnail}
                      alt={item.itemName}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex items-center justify-center ${item.itemThumbnail ? 'hidden' : ''}`}
                  >
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.itemName}</h3>
                  <p className="text-sm text-gray-600">
                    Mã sản phẩm: {item.productId.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-gray-600">Mã item: {item.itemId.slice(0, 8)}...</p>
                  {item.discount > 0 && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.basePrice + item.discount)}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        -{formatPrice(item.discount)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800">{formatPrice(item.basePrice)}</p>
                  {item.discount > 0 && (
                    <p className="text-sm text-green-600">Đã giảm {formatPrice(item.discount)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
              <span className="text-2xl font-bold text-[#121212]">
                {formatPrice(currentOrder.grandPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Thông tin giao hàng
          </h2>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Người nhận</h3>
                <div className="space-y-1 text-blue-700">
                  <p className="font-medium">{currentOrder.destination.customerName}</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{currentOrder.destination.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Địa chỉ giao hàng</h3>
                <div className="text-blue-700">
                  <p>{currentOrder.destination.addressLine}</p>
                  <p>
                    {currentOrder.destination.ward}, {currentOrder.destination.district}
                  </p>
                  <p>{currentOrder.destination.state}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#525252]/20">
          <div className="flex flex-wrap gap-3">
            {currentOrder.orderStatus === 'Delivered' && (
              <>
                <button className="flex items-center space-x-2 px-6 py-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium">
                  <Star className="w-5 h-5" />
                  <span>Đánh giá sản phẩm</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
                  <Heart className="w-5 h-5" />
                  <span>Mua lại</span>
                </button>
              </>
            )}

            {currentOrder.orderStatus === 'Payment Confirmation' && (
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                <CreditCard className="w-5 h-5" />
                <span>Thanh toán ngay</span>
              </button>
            )}

            <button className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              <MessageCircle className="w-5 h-5" />
              <span>Liên hệ người bán</span>
            </button>

            <Link href="/user/purchase">
              <button className="flex items-center space-x-2 px-6 py-3 bg-[#FFD2B2] text-[#121212] rounded-lg hover:bg-[#FFBB99] transition-colors font-medium">
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại danh sách</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
