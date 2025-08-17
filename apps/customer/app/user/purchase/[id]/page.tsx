'use client';

import BuyAgainDialog from '@/components/common/BuyAgainDialog';
import OrderStatusChangeDialog from '@/components/order/OrderStatusChangeDialog';
import PaymentStatus from '@/components/payment/PaymentStatus';
import { useToast } from '@/context/ToastContext';
import { useOrderDetail } from '@/hooks/use-order-detail';
import { orderApi } from '@/services/order.api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Edit3,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Receipt,
  ShoppingCart,
  Star,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { currentOrder, isLoading, error, getStatusDisplay, getOrderById } =
    useOrderDetail(orderId);
  const { showToast } = useToast();
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [showBuyAgainDialog, setShowBuyAgainDialog] = useState(false);
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);

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

  const showButtonBuyAgain = () => {
    if (!currentOrder || !currentOrder.items || currentOrder.items.length === 0) {
      return false;
    } else if (
      currentOrder.orderStatus === 'COMPLETED' ||
      currentOrder.orderStatus === 'RETURNED' ||
      currentOrder.orderStatus !== 'DELIVERED'
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  const handleStatusChange = async (
    action: 'cancel' | 'complete' | 'return' | 'confirm',
    reason?: string,
  ) => {
    try {
      let updatedOrder;

      switch (action) {
        case 'cancel':
          updatedOrder = await orderApi.cancelOrder(orderId, reason!);
          showToast('Đơn hàng đã được hủy thành công', 'success');
          break;
        case 'complete':
          updatedOrder = await orderApi.completeOrder(orderId);
          showToast('Đơn hàng đã được hoàn thành', 'success');
          break;
        case 'return':
          updatedOrder = await orderApi.requestReturn(orderId, reason!);
          showToast('Yêu cầu trả hàng đã được gửi', 'success');
          break;
        case 'confirm':
          updatedOrder = await orderApi.confirmRetrieved(orderId);
          showToast('Đã xác nhận nhận hàng thành công', 'success');
          break;
      }

      await getOrderById();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng', 'error');
      throw error;
    }
  };

  const canChangeStatus = () => {
    if (!currentOrder) return false;
    const status = currentOrder.orderStatus;
    return (
      status === 'Pending' ||
      status === 'Payment Confirmation' ||
      status === 'Delivered' ||
      status === 'RETRIEVED'
    );
  };

  const getStatusDisplayWithDescription = (statusId: string) => {
    const baseStatus = getStatusDisplay(statusId);
    return {
      ...baseStatus,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-orange-200 rounded-lg"></div>
                <div className="h-8 bg-orange-200 rounded w-48"></div>
              </div>
              <div className="h-4 bg-orange-200 rounded w-full"></div>
              <div className="h-4 bg-orange-200 rounded w-3/4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-orange-100 rounded"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại hoặc đã bị xóa'}</p>
            <Link href="/user/purchase">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                Quay lại danh sách đơn hàng
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplayWithDescription(currentOrder.orderStatusId);
  const totalItems = currentOrder.items.length;
  const totalValue = currentOrder.grandPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/user/purchase">
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-100 text-sm">Mã đơn hàng:</span>
                      <span className="font-medium">#{orderId.slice(0, 8)}...</span>
                      <button
                        onClick={handleCopyOrderId}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Sao chép mã đơn hàng"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copiedOrderId && (
                        <span className="text-xs text-green-200 font-medium">Đã sao chép!</span>
                      )}
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-white/20 text-white border-white/30`}
                    >
                      <statusDisplay.icon className="w-4 h-4" />
                      <span>{statusDisplay.description}</span>
                    </div>
                  </div>
                  {currentOrder.createDate && (
                    <div className="text-sm text-orange-100 mt-1">
                      <span>Mua {formatDate(currentOrder.createDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              Trạng thái đơn hàng
            </h2>
            {canChangeStatus() && (
              <button
                onClick={() => setShowStatusChangeDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
              >
                <Edit3 className="w-4 h-4" />
                <span>Quản lý đơn hàng</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div
              className={`p-3 rounded-full ${statusDisplay.color.replace('border-', 'bg-').replace('text-', 'text-white ').split(' ')[0]} text-white`}
            >
              <statusDisplay.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{statusDisplay.label}</h3>
              <p className="text-sm text-gray-600">{statusDisplay.description}</p>
            </div>
          </div>
        </div>

        <PaymentStatus orderId={orderId} />
        <BuyAgainDialog
          isOpen={showBuyAgainDialog}
          onClose={() => setShowBuyAgainDialog(false)}
          items={currentOrder.items}
        />
        <OrderStatusChangeDialog
          isOpen={showStatusChangeDialog}
          onClose={() => setShowStatusChangeDialog(false)}
          order={currentOrder}
          onStatusChange={handleStatusChange}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Receipt className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng giá trị</p>
                <p className="text-xl font-bold text-gray-800">{formatPrice(totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày đặt</p>
                <p className="text-sm font-bold text-gray-800">
                  {formatDate(currentOrder.createDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            Thông tin người bán
          </h2>
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200">
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
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Nhắn tin</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors">
                <User className="w-4 h-4" />
                <span>Xem shop</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            Sản phẩm đã đặt
          </h2>
          <div className="space-y-3">
            {currentOrder.items.map((item) => (
              <div
                key={item.itemId}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.itemThumbnail ? (
                    <Image
                      src={item.itemThumbnail}
                      alt={item.itemName}
                      width={64}
                      height={64}
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
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 leading-relaxed">{item.itemName}</h4>
                  <p className="text-sm text-gray-600">
                    Mã sản phẩm: {item.productId.slice(0, 8)}...
                  </p>
                  {item.quantity > 0 && (
                    <p className="text-sm text-orange-600">Số lượng: {item.quantity} món</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatPrice(item.basePrice)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-orange-200">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
              <span className="text-2xl font-bold text-gray-800">
                {formatPrice(currentOrder.grandPrice)}
              </span>
            </div>
          </div>
          {showButtonBuyAgain() && (
            <div className="mt-6 pt-4 border-t border-orange-200">
              <button
                onClick={() => setShowBuyAgainDialog(true)}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Mua lại</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            Thông tin giao hàng
          </h2>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-3">Người nhận</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="font-medium text-gray-800">
                    {currentOrder.destination.customerName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>{currentOrder.destination.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-3">Địa chỉ giao hàng</h3>
                <div className="text-gray-600 space-y-1">
                  <p className="leading-relaxed">
                    {currentOrder.destination.addressLine} {currentOrder.destination.ward},{' '}
                    {currentOrder.destination.district} {currentOrder.destination.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
          <div className="flex flex-wrap gap-3">
            {currentOrder.orderStatus === 'DELIVERED' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                  <Star className="w-4 h-4" />
                  <span>Đánh giá</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                  <Heart className="w-4 h-4" />
                  <span>Mua lại</span>
                </button>
              </>
            )}

            <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
              <MessageCircle className="w-4 h-4" />
              <span>Liên hệ người bán</span>
            </button>

            <Link href="/user/purchase">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
