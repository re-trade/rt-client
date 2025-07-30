'use client';

import Modal from '@/components/reusable/modal';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/hooks/use-order';
import { usePayment } from '@/hooks/use-payment';
import { TProduct, productApi } from '@/services/product.api';
import { CreateOrderRequest } from '@services/order.api';
import { IconAlertTriangle, IconCheck, IconCreditCard, IconMapPin } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { contacts, selectedAddressId, selectAddress } = useCart();

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
  const [productDetail, setProductDetail] = useState<TProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  // Get product ID and quantity from searchParams
  const productId = searchParams.get('productId');
  const quantityFromUrl = parseInt(searchParams.get('quantity') || '1', 10);

  // Fetch product detail and payment methods
  useEffect(() => {
    getPaymentMethods().catch(console.error);

    if (productId) {
      const validatedQuantity = isNaN(quantityFromUrl) || quantityFromUrl < 1 ? 1 : quantityFromUrl;
      setQuantity(validatedQuantity);

      const fetchProduct = async () => {
        setIsLoadingProduct(true);
        setProductError(null);
        try {
          const product = await productApi.getProduct(productId);
          setProductDetail(product);

          if (product.quantity < validatedQuantity) {
            setProductError('Số lượng yêu cầu vượt quá số lượng có sẵn.');
            setQuantity(product.quantity);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setProductError('Không thể tải thông tin sản phẩm. Vui lòng thử lại.');
        } finally {
          setIsLoadingProduct(false);
        }
      };

      fetchProduct();
    }
  }, [productId, quantityFromUrl, getPaymentMethods]);

  const navigateHome = () => router.push('/');
  const navigateCart = () => router.push('/cart');

  // Calculate order summary
  const calculateOrderSummary = () => {
    if (!productDetail) {
      return { originalPrice: 0, tax: 0, total: 0 };
    }

    const originalPrice = productDetail.currentPrice * quantity;
    const tax = Math.round(originalPrice * 0.1);
    const total = originalPrice + tax;

    return { originalPrice, tax, total };
  };

  const orderSummary = calculateOrderSummary();
  const selectedAddress = contacts?.find((c) => c.id === selectedAddressId);

  // Validation
  const validateOrder = (): string | null => {
    if (!selectedAddressId) return 'Vui lòng chọn địa chỉ giao hàng';
    if (!productDetail) return 'Thông tin sản phẩm không khả dụng';
    if (!selectedPaymentMethodId) return 'Vui lòng chọn phương thức thanh toán';
    if (productError) return productError;
    return null;
  };

  // Handle checkout
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
        items: [
          {
            productId: productDetail!.id,
            quantity: quantity,
          },
        ],
        addressId: selectedAddressId!,
      };

      const createdOrder = await createOrder(orderPayload);

      if (createdOrder) {
        setCreatedOrderId(createdOrder.orderId);

        const paymentPayload = {
          paymentMethodId: selectedPaymentMethodId!,
          paymentContent: 'Thanh toán đơn hàng',
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
    productDetail && !productError && selectedAddressId && selectedPaymentMethodId && !isProcessing;

  console.log('CheckoutPage rendered with:', selectedAddress);
  // Loading state
  if (isLoadingProduct) {
    return (
      <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (productError) {
    return (
      <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <IconAlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi tải sản phẩm</h2>
            <p className="text-gray-600 mb-6">{productError}</p>
            <button
              onClick={navigateHome}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!productDetail) {
    return (
      <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-orange-400"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Không có sản phẩm để thanh toán
            </h2>
            <p className="text-gray-600 mb-6">Vui lòng chọn sản phẩm để thanh toán.</p>
            <button
              onClick={navigateHome}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
        {/* Breadcrumb */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <button
              onClick={navigateHome}
              className="hover:text-orange-600 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Trang chủ
            </button>
            <span>/</span>
            <span className="font-medium text-orange-600">Thanh toán</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Thanh Toán
          </h1>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  Sản phẩm
                </h3>
              </div>

              <div className="p-4 md:p-6">
                <div className="flex items-center gap-4 p-4 border border-orange-100 rounded-lg bg-orange-25">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white p-1 flex-shrink-0">
                    <Image
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded"
                      src={productDetail.thumbnail}
                      alt={productDetail.name}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2">{productDetail.name}</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Số lượng:</span>
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                              type="button"
                              onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                            >
                              -
                            </button>
                            <span className="px-3 py-1">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity((prev) => prev + 1)}
                              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600">
                          Đơn giá: {productDetail.currentPrice.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600 text-xl">
                          {orderSummary.originalPrice.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            {/* Payment Method */}
            <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <IconMapPin className="w-5 h-5 text-white" />
                  </div>
                  Địa chỉ giao hàng
                </h3>
              </div>

              <div className="p-4 md:p-6">
                <select
                  value={selectedAddressId ?? ''}
                  onChange={(e) => selectAddress(e.target.value)}
                  className="w-full rounded-lg border border-orange-200 bg-white px-4 py-3 text-gray-700 shadow-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                >
                  <option value="" disabled>
                    -- Chọn địa chỉ --
                  </option>
                  {contacts?.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.customerName} - {address.phone} - {address.name}
                    </option>
                  ))}
                </select>

                {selectedAddress && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Địa chỉ đã chọn:</p>
                        <p className="font-semibold text-gray-800">{selectedAddress.name}</p>
                        <p className="text-sm text-gray-600">
                          {selectedAddress.customerName} - {selectedAddress.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedAddress.addressLine}, {selectedAddress.ward},{' '}
                          {selectedAddress.district}, {selectedAddress.state},{' '}
                          {selectedAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <IconCreditCard className="w-5 h-5 text-white" />
                  </div>
                  Phương thức thanh toán
                </h3>
              </div>

              <div className="p-4 md:p-6">
                {isLoadingMethods ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-gray-600">Đang tải...</span>
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
                              <IconCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky top-6">
              <div className="rounded-xl border border-orange-100 bg-white shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 md:p-6 border-b border-orange-100">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
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
                    Tổng đơn hàng
                  </h3>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Giá gốc</span>
                      <span className="font-semibold text-gray-800">
                        {orderSummary.originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Thuế (10%)</span>
                      <span className="font-semibold text-gray-800">
                        {orderSummary.tax.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
                      <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                      <span className="text-xl font-bold text-orange-600">
                        {orderSummary.total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={!canCheckout}
                    className={`w-full mt-6 font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                      canCheckout
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:shadow-xl transform hover:scale-[1.02]'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>
                          {isCreating ? 'Đang tạo đơn hàng...' : 'Đang khởi tạo thanh toán...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
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
                        <span>Tiến hành thanh toán</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={navigateHome}
            className="group inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors bg-transparent border-none p-2 cursor-pointer rounded-lg hover:bg-orange-50"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Tiếp tục mua sắm</span>
          </button>
        </div>
      </div>

      {/* Success/Error Modal */}
      <Modal
        opened={showOrderModal}
        onClose={handleOrderModalClose}
        title={orderSuccess ? 'Đặt hàng thành công!' : 'Lỗi đặt hàng'}
        size="md"
      >
        <div className="p-6 text-center">
          <div
            className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4 ${orderSuccess ? 'bg-green-100' : 'bg-red-100'}`}
          >
            {orderSuccess ? (
              <IconCheck className="w-8 h-8 text-green-600" />
            ) : (
              <IconAlertTriangle className="w-8 h-8 text-red-600" />
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
    </section>
  );
};

export default CheckoutPage;
