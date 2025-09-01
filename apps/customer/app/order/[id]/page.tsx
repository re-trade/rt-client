'use client';

import PaymentHistory from '@/components/order/PaymentHistory';
import PaymentMethodSelection from '@/components/order/PaymentMethodSelection';
import PaymentStatus from '@/components/order/PaymentStatus';
import { useToast } from '@/context/ToastContext';
import { useOrderById } from '@/hooks/use-order-by-id';
import { useOrderPayment } from '@/hooks/use-order-payment';
import { useOrderPaymentMethods } from '@/hooks/use-order-payment-methods';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Copy,
  MapPin,
  Package,
  Phone,
  Receipt,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrderPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const { showToast } = useToast();

  const { order, isLoading, error } = useOrderById(orderId || '');
  const {
    paymentStatus,
    paymentHistory,
    isLoadingStatus,
    isLoadingHistory,
    fetchPaymentStatus,
    fetchPaymentHistory,
    refreshPaymentData,
  } = useOrderPayment();

  const {
    paymentMethods,
    selectedPaymentMethodId,
    isLoadingMethods,
    isInitializingPayment,
    error: paymentError,
    getPaymentMethods,
    selectPaymentMethod,
    initPayment,
    clearError: clearPaymentError,
  } = useOrderPaymentMethods();

  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      showToast('Đã sao chép mã đơn hàng', 'success');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Thành công';
      case 'PENDING':
        return 'Đang xử lý';
      case 'FAILED':
        return 'Thất bại';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'CREATED':
        return 'Đã tạo';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (orderId && order) {
      refreshPaymentData(orderId);
    }
  }, [orderId, order, refreshPaymentData]);

  useEffect(() => {
    getPaymentMethods();
  }, [getPaymentMethods]);

  const handlePayment = async () => {
    if (!selectedPaymentMethodId) {
      showToast('Vui lòng chọn phương thức thanh toán', 'error');
      return;
    }

    clearPaymentError();

    try {
      showToast('Đang khởi tạo thanh toán...', 'info');

      const paymentPayload = {
        paymentMethodId: selectedPaymentMethodId,
        paymentContent: `Thanh toán đơn hàng #${orderId}`,
        orderId: orderId,
      };

      const paymentUrl = await initPayment(paymentPayload);

      if (!paymentUrl || paymentUrl.trim() === '') {
        throw new Error('Không nhận được URL thanh toán từ server');
      }

      showToast('Đang chuyển hướng đến cổng thanh toán...', 'info');

      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.message || 'Không thể khởi tạo thanh toán. Vui lòng thử lại.';
      showToast(errorMessage, 'error');
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200 text-center">
            <Package className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h1>
            <p className="text-gray-600 mb-6">Vui lòng cung cấp mã đơn hàng hợp lệ</p>
            <Link href="/user/purchase">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 mx-auto">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách đơn hàng</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-orange-100 rounded-lg w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-orange-100 rounded w-full"></div>
                <div className="h-4 bg-orange-100 rounded w-3/4"></div>
                <div className="h-4 bg-orange-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-orange-200 text-center">
            <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải đơn hàng</h1>
            <p className="text-gray-600 mb-6">{error || 'Không thể tải thông tin đơn hàng'}</p>
            <Link href="/user/purchase">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 mx-auto">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại danh sách đơn hàng</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-6">
      <div className="max-w-5xl mx-auto px-4 space-y-4">
        <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold mb-2">Chi tiết đơn hàng</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    <span className="font-medium">#{orderId.slice(0, 8)}...</span>
                    <button
                      onClick={copyOrderId}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-white/20 text-white border-white/30">
                    <Package className="w-4 h-4" />
                    {order.status}
                  </div>
                  {paymentStatus && (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        paymentStatus.paid
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {paymentStatus.paid ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {paymentStatus.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Chi tiết khách hàng
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Thông tin đặt hàng</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Tên khách hàng</p>
                  <p className="font-medium text-gray-800">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mã khách hàng</p>
                  <p className="font-medium text-gray-800">{order.customerId}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Địa chỉ giao hàng
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                <p className="font-medium text-gray-800 mb-1">{order.destination.customerName}</p>
                <p className="text-sm text-gray-700 mb-2">
                  {order.destination.addressLine}, {order.destination.ward},{' '}
                  {order.destination.district}, {order.destination.state}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {order.destination.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Sản phẩm đã đặt
              </h2>

              {(() => {
                const sellerGroups = {};
                if (order.items && order.items.length > 0) {
                  order.items.forEach((item) => {
                    if (!sellerGroups[item.sellerName]) {
                      sellerGroups[item.sellerName] = {
                        name: item.sellerName,
                        items: [],
                        totalPrice: 0,
                      };
                    }
                    sellerGroups[item.sellerName].items.push(item);
                    sellerGroups[item.sellerName].totalPrice += item.totalPrice;
                  });
                }

                return Object.values(sellerGroups).map((sellerGroup: any, sellerIndex) => (
                  <div
                    key={sellerIndex}
                    className="mb-3 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-2 border-b border-orange-300">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-700" />
                          <h3 className="font-bold text-orange-800 text-sm">{sellerGroup.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-800 text-sm">
                            {formatPrice(sellerGroup.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-orange-100">
                      {sellerGroup.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-3 p-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {item.productThumbnail ? (
                              <Image
                                src={item.productThumbnail}
                                alt={item.productName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-800 text-sm truncate">
                              {item.productName}
                            </h3>
                            <p className="text-xs text-gray-600 truncate">
                              {item.shortDescription}
                            </p>
                            <p className="text-xs text-gray-600">
                              SL: {item.quantity} × {formatPrice(item.unitPrice)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-orange-600 text-sm">
                              {formatPrice(item.totalPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Tóm tắt đơn hàng</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium text-gray-800">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="border-t border-orange-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Tổng cộng:</span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatPrice(order.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <PaymentHistory
              paymentHistory={paymentHistory}
              isLoadingHistory={isLoadingHistory}
              formatPrice={formatPrice}
              formatDate={formatDate}
              getPaymentStatusColor={getPaymentStatusColor}
              getPaymentStatusText={getPaymentStatusText}
            />
          </div>

          <div className="space-y-4">
            <PaymentStatus
              paymentStatus={paymentStatus}
              isLoadingStatus={isLoadingStatus}
              order={order}
              paymentHistory={paymentHistory}
              orderId={orderId}
              refreshPaymentData={refreshPaymentData}
              formatPrice={formatPrice}
              formatDate={formatDate}
            />

            {paymentStatus && !paymentStatus.paid && (
              <PaymentMethodSelection
                paymentMethods={paymentMethods}
                selectedPaymentMethodId={selectedPaymentMethodId}
                isLoadingMethods={isLoadingMethods}
                isInitializingPayment={isInitializingPayment}
                paymentError={paymentError}
                onSelectPaymentMethod={selectPaymentMethod}
                onPayment={handlePayment}
                onRefreshStatus={() => {
                  showToast('Đang kiểm tra trạng thái thanh toán...', 'info');
                  refreshPaymentData(orderId);
                }}
              />
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/user/purchase">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg">
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách đơn hàng</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
