'use client';

import Modal from '@/components/reusable/modal';
import { useCart } from '@/hooks/use-cart';
import { useOrder } from '@/hooks/use-order';
import { usePayment } from '@/hooks/use-payment';
import { TProduct } from '@/services/product.api';
import { CreateOrderRequest } from '@services/order.api';
import AddressCreateDialog from '@/components/address/AddressCreateDialog';
import { AlertTriangle, Check, CreditCard, MapPin, X, Plus, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCheckoutAddressManager } from '@/hooks/use-checkout-address-manager';
import { set } from 'date-fns';

// Updated TAddress type with additional fields
export type TAddress = {
  id: string;
  customerName: string;
  phone: string;
  state: string;
  country: string;
  district: string;
  ward: string;
  addressLine: string;
  name: string;
  defaulted: boolean;
  type: number;
};

interface BuyNowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: TProduct;
  initialQuantity?: number;
}

const BuyNowDialog: React.FC<BuyNowDialogProps> = ({
  isOpen,
  onClose,
  product,
  initialQuantity = 1,
}) => {
  const router = useRouter();
  const { contacts, selectedAddressId, selectAddress } = useCart();

  const { isCreating, error: orderError, clearError } = useOrder();
  const { createOrder } = useCart();
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

  const {
    addresses,
    selectedAddress: addressManagerSelectedAddress,
    isCreateOpen,
    isSelectionOpen,
    openSelectionDialog,
    openCreateFromSelection,
    closeDialogs,
    selectAddress: addressManagerSelectAddress,
    createAddress,
    formData,
    errors,
    touched,
    provinces,
    districts,
    wards,
    loading: addressLoading,
    submitting,
    addressesLoading,
    handleFieldChange,
    handleFieldBlur,

  } = useCheckoutAddressManager();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [showResult, setShowResult] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'details' | 'processing' | 'result'>('details');

  // Address selection states
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showCreateAddressDialog, setShowCreateAddressDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(Math.min(initialQuantity, product.quantity));
      setCurrentStep('details');
      setShowResult(false);
      setOrderSuccess(false);
      setCreatedOrderId(null);
      setShowAddressDropdown(false);
      setShowCreateAddressDialog(false);
      clearError();
      clearPaymentError();

      getPaymentMethods().catch(console.error);
    }
  }, [
    isOpen, 
    initialQuantity, 
    product.quantity, 
    getPaymentMethods, 
    clearError, 
    clearPaymentError,
  ]);

  // Debug logs để kiểm tra dữ liệu
  useEffect(() => {
    if (isOpen) {
      console.log('BuyNowDialog - Provinces loaded:', provinces?.length);
      console.log('BuyNowDialog - Address loading:', addressLoading);
      console.log('BuyNowDialog - Form data:', formData);
    }
  }, [isOpen, provinces, addressLoading, formData]);

  const calculateOrderSummary = () => {
    const originalPrice = product.currentPrice * quantity;
    const total = originalPrice;
    return { originalPrice, total };
  };

  const orderSummary = calculateOrderSummary();
  const selectedAddress = contacts?.find((c) => c.id === selectedAddressId);

  const validateOrder = (): string | null => {
    if (!selectedAddressId) return 'Vui lòng chọn địa chỉ giao hàng';
    if (!selectedPaymentMethodId) return 'Vui lòng chọn phương thức thanh toán';
    if (quantity > product.quantity) return 'Số lượng yêu cầu vượt quá số lượng có sẵn';
    if (quantity < 1) return 'Số lượng phải lớn hơn 0';
    return null;
  };

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, product.quantity));
    setQuantity(validQuantity);
  };

  const handleAddressSelect = (addressId: string) => {
    selectAddress(addressId);
    setShowAddressDropdown(false);
  };

  const handleCreateAddressClick = () => {
    setShowAddressDropdown(false);
    setShowCreateAddressDialog(true);
  };

  const handleCreateAddressSuccess = async () => {
    try {
      const success = await createAddress();
      if (success) {
        setShowCreateAddressDialog(false);
        setShowAddressDropdown(false);
      }
      return false;
    } catch (error) {
      console.error('Error creating address:', error);
      return false;
    }
  };

  const handleBuyNow = async () => {
    clearError();
    clearPaymentError();

    const validationError = validateOrder();
    if (validationError) {
      alert(validationError);
      return;
    }

    setCurrentStep('processing');

    try {
      const orderPayload: CreateOrderRequest = {
        items: [
          {
            productId: product.id,
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
          paymentContent: `Thanh toán đơn hàng ${createdOrder.orderId}`,
          orderId: createdOrder.orderId,
        };

        const paymentUrl = await initPayment(paymentPayload);

        if (!paymentUrl || paymentUrl.trim() === '') {
          throw new Error('Không nhận được URL thanh toán từ server');
        }

        setOrderSuccess(true);
        setCurrentStep('result');
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderSuccess(false);
      setCurrentStep('result');
    }
  };

  const handleClose = () => {
    if (currentStep === 'processing') return;

    if (orderSuccess && createdOrderId) {
      router.push(`/orders/${createdOrderId}`);
    }

    // Đóng tất cả dialogs
    closeDialogs();
    onClose();
  };

  const isProcessing = isCreating || isInitializingPayment;
  const canPurchase = selectedAddressId && selectedPaymentMethodId && !isProcessing && quantity > 0;

  const renderAddressSelector = () => {
    return (
      <div className="relative">
        <button
          onClick={() => setShowAddressDropdown(!showAddressDropdown)}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-left flex items-center justify-between transition-all duration-200 ${showAddressDropdown
              ? 'border-orange-600 ring-2 ring-orange-200'
              : 'border-gray-300 hover:border-orange-400'
            }`}
        >
          <div className="flex-1">
            {selectedAddress ? (
              <div>
                <div className="font-medium text-gray-900">{selectedAddress.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedAddress.customerName} 
                </div>
                <div className="text-gray-600"> Số điện thoại:  {selectedAddress.phone} </div>
                <div className="text-sm text-gray-500 mt-1">
                Địa chỉ:  {selectedAddress.addressLine}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.state}, {selectedAddress.country}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">-- Chọn địa chỉ giao hàng --</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showAddressDropdown ? 'rotate-180' : ''
            }`} />
        </button>

        {showAddressDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {contacts && contacts.length > 0 ? (
              contacts.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleAddressSelect(address.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${selectedAddressId === address.id ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${address.defaulted ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{address.name}</span>
                        {address.defaulted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        {address.customerName} - {address.phone}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {address.addressLine}, {address.ward}, {address.district}, {address.state}, {address.country}
                      </div>
                    </div>
                    {selectedAddressId === address.id && (
                      <Check className="w-4 h-4 text-orange-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">Chưa có địa chỉ nào</p>
              </div>
            )}

            {/* Add New Address Button */}
            <button
              onClick={handleCreateAddressClick}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-t border-gray-200 flex items-center gap-3 text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Thêm địa chỉ mới</span>
            </button>
          </div>
        )}

        {/* Overlay to close dropdown */}
        {showAddressDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAddressDropdown(false)}
          />
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'processing':
        return (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isCreating ? 'Đang tạo đơn hàng...' : 'Đang khởi tạo thanh toán...'}
            </h3>
            <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
          </div>
        );

      case 'result':
        return (
          <div className="p-8 text-center">
            <div
              className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4 ${orderSuccess ? 'bg-green-100' : 'bg-red-100'}`}
            >
              {orderSuccess ? (
                <Check className="w-8 h-8 text-green-600" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              )}
            </div>

            {orderSuccess ? (
              <div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Đơn hàng đã được tạo thành công!
                </h3>
                <p className="mb-6 text-sm text-gray-600">
                  Bạn sẽ được chuyển đến trang thanh toán trong giây lát...
                </p>
              </div>
            ) : (
              <div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Không thể tạo đơn hàng</h3>
                <p className="mb-6 text-gray-600">
                  {orderError ||
                    paymentError ||
                    'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.'}
                </p>
                <button
                  onClick={() => setCurrentStep('details')}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Product Details */}
            <div className="p-6 border-b border-gray-100 hover:bg-gray-50/30 transition-colors duration-200">
              <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-sm">
                  <Image
                    width={96}
                    height={96}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    src={product.thumbnail}
                    alt={product.name}
                  />
                  <div className="absolute inset-0 bg-black/5 rounded-xl"></div>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-orange-600 font-bold text-xl">
                        {product.currentPrice.toLocaleString('vi-VN')}₫
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Còn {product.quantity} sp
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-orange-400 transition-colors duration-200">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-orange-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 hover:text-orange-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>

                        <div className="flex items-center justify-center min-w-[50px] h-10 px-3 bg-white border-x border-gray-200">
                          <span className="font-semibold text-gray-900">{quantity}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.quantity}
                          className="flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-orange-50 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 hover:text-orange-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Tổng cộng</p>
                        <p className="font-bold text-lg text-gray-900">
                          {orderSummary.originalPrice.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Địa chỉ giao hàng
              </h4>

              {renderAddressSelector()}

              {selectedAddress && (
                <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800">{selectedAddress.name}</p>
                        {selectedAddress.defaulted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-1">
                        {selectedAddress.customerName} 
                      </p>
                      <p className="text-gray-600">
                         Số điện thoại: {selectedAddress.phone}
                        </p>
                      <p className="text-gray-600">
                       Địa chỉ:  {selectedAddress.addressLine}, {selectedAddress.ward},{' '}
                        {selectedAddress.district}, {selectedAddress.state},{' '}
                        {selectedAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                Phương thức thanh toán
              </h4>

              {isLoadingMethods ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
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
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethodId === method.id
                          ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200'
                          : 'border-gray-200 hover:border-orange-400 bg-white hover:shadow-md'
                        }`}
                      onClick={() => selectPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-6 flex-shrink-0">
                          <Image
                            src={method.imgUrl}
                            alt={method.name}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">{method.name}</h5>
                          <p className="text-xs text-gray-600">{method.description}</p>
                        </div>
                        {selectedPaymentMethodId === method.id && (
                          <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Tổng đơn hàng</h4>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Tổng cộng</span>
                  <span className="text-orange-600">
                    {orderSummary.total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={!canPurchase}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${canPurchase
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Mua ngay</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
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
        );
    }
  };

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={handleClose}
        title={currentStep === 'details' ? 'Mua ngay' : ''}
        size="lg"
        centered
        closeOnClickOutside={currentStep !== 'processing'}
        closeOnEscape={currentStep !== 'processing'}
      >
        {currentStep === 'details' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {renderContent()}
      </Modal>

      {/* Address Create Dialog */}
      <AddressCreateDialog
        open={showCreateAddressDialog}
        onCreate={handleCreateAddressSuccess}
        onClose={() => setShowCreateAddressDialog(false)}
        formData={formData}
        errors={errors}
        touched={touched}
        provinces={provinces}
        districts={districts}
        wards={wards}
        loading={addressLoading}
        submitting={submitting}
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
      />
    </>
  );
};

export default BuyNowDialog;