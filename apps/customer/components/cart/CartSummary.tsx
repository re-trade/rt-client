'use client';
import Modal from '@/components/reusable/modal';
import { useCart } from '@/hooks/use-cart';
import { useOrder } from '@/hooks/use-order';
import { usePayment } from '@/hooks/use-payment';
import { CreateOrderRequest } from '@services/order.api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartSummary({
  cartSummary,
  contacts,
  selectedAddressId,
  selectAddress,
  selectedItems,
}: ReturnType<typeof useCart>) {
  const router = useRouter();
  const { createOrder, isCreating, error: orderError, clearError } = useOrder();
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
  } = usePayment();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  useEffect(() => {
    getPaymentMethods().catch(console.error);
  }, [getPaymentMethods]);

  const finalTotal = cartSummary.total;

  const validateOrder = (): string | null => {
    if (!selectedAddressId) {
      return 'Vui lòng chọn địa chỉ giao hàng';
    }

    if (!selectedItems || selectedItems.length === 0) {
      return 'Vui lòng chọn ít nhất một sản phẩm';
    }

    if (!selectedPaymentMethodId) {
      return 'Vui lòng chọn phương thức thanh toán';
    }

    return null;
  };

  const handleCheckout = async () => {
    clearError();
    clearPaymentError();

    const validationError = validateOrder();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const orderPayload: CreateOrderRequest = {
        items: selectedItems,
        addressId: selectedAddressId!,
      };

      const createdOrder = await createOrder(orderPayload);

      if (createdOrder) {
        setCreatedOrderId(createdOrder.orderId);

        const paymentPayload = {
          paymentMethodId: selectedPaymentMethodId!,
          paymentContent: 'Cam on seller',
          orderId: createdOrder.orderId,
        };

        const paymentUrl = await initPayment(paymentPayload);

        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error('Không nhận được URL thanh toán');
        }
      }
    } catch {
      setOrderSuccess(false);
      setShowOrderModal(true);
    }
  };

  const handleOrderModalClose = () => {
    setShowOrderModal(false);
    if (orderSuccess) {
      if (createdOrderId) {
        router.push(`/orders/${createdOrderId}`);
      } else {
        router.push('/orders');
      }
    }
  };

  const isProcessing = isCreating || isInitializingPayment;
  const canCheckout =
    selectedItems &&
    selectedItems.length > 0 &&
    selectedAddressId &&
    selectedPaymentMethodId &&
    !isProcessing;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-800">Địa chỉ giao hàng</h3>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-orange-25">
          <label
            htmlFor="address-select"
            className="block text-sm font-semibold text-gray-700 mb-3"
          >
            Chọn địa chỉ giao hàng:
          </label>
          <div className="relative">
            <select
              id="address-select"
              value={selectedAddressId ?? ''}
              onChange={(e) => selectAddress(e.target.value)}
              className="w-full rounded-lg border border-orange-200 bg-white px-4 py-3 text-sm md:text-base text-gray-700 shadow-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 hover:border-orange-300 appearance-none"
            >
              <option value="" disabled>
                -- Chọn địa chỉ --
              </option>
              {contacts.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.customerName} - {address.phone} - {address.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {selectedAddressId && (
            <div className="mt-4 p-3 md:p-4 bg-white rounded-lg border border-orange-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Địa chỉ đã chọn:</p>
                  <p className="font-semibold text-sm md:text-base text-gray-800 break-words">
                    {contacts.find((c) => c.id === selectedAddressId)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-800">Phương thức thanh toán</h3>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-orange-25">
          {isLoadingMethods ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Đang tải phương thức thanh toán...</span>
            </div>
          ) : paymentError ? (
            <div className="text-center py-4">
              <p className="text-red-600 mb-2">{paymentError}</p>
              <button
                onClick={() => getPaymentMethods()}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethodId === method.id
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                  onClick={() => selectPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-8 flex-shrink-0">
                      <Image
                        src={method.imgUrl}
                        alt={method.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {selectedPaymentMethodId === method.id && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-gray-800">Tổng đơn hàng</h3>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-orange-25 space-y-4">
          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-50 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></div>
                <span className="text-sm md:text-base font-medium text-gray-600">Giá gốc</span>
              </div>
              <span className="text-sm md:text-base font-semibold text-gray-800">
                {cartSummary.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-50 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                <span className="text-sm md:text-base font-medium text-gray-600">Thuế</span>
              </div>
              <span className="text-sm md:text-base font-semibold text-gray-800">
                {cartSummary.tax.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-4">
            <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-600 flex-shrink-0"></div>
                <span className="text-base md:text-lg font-bold text-gray-900">Tổng cộng</span>
              </div>
              <span className="text-lg md:text-xl font-bold text-orange-600">
                {finalTotal.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!canCheckout}
            className={`w-full mt-4 md:mt-6 font-semibold py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 group ${
              canCheckout
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm md:text-base">
                  {isCreating ? 'Đang tạo đơn hàng...' : 'Đang khởi tạo thanh toán...'}
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L17 18"
                  />
                </svg>
                <span className="text-sm md:text-base">Tiến hành thanh toán</span>
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 mt-4">
            <svg
              className="w-4 h-4 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Thanh toán an toàn & bảo mật</span>
          </div>
        </div>
      </div>
      <Modal
        opened={showOrderModal}
        onClose={handleOrderModalClose}
        title={orderSuccess ? 'Đặt hàng thành công!' : 'Lỗi đặt hàng'}
        size="md"
      >
        <div className="p-6 text-center">
          <div
            className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              orderSuccess ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {orderSuccess ? (
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>

          {orderSuccess ? (
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Đơn hàng đã được tạo thành công!
              </h3>
              <p className="mb-4 text-gray-600">
                Mã đơn hàng:{' '}
                <span className="font-mono font-bold text-orange-600">{createdOrderId}</span>
              </p>
              <p className="mb-6 text-sm text-gray-600">
                Bạn sẽ được chuyển đến trang chi tiết đơn hàng để theo dõi trạng thái.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Không thể tạo đơn hàng</h3>
              <p className="mb-6 text-gray-600">
                {orderError || paymentError || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.'}
              </p>
            </div>
          )}

          <button
            onClick={handleOrderModalClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              orderSuccess
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {orderSuccess ? 'Xem đơn hàng' : 'Đóng'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
