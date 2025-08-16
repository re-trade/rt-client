'use client';
import { useCart } from '@/hooks/use-cart';
import { useCheckoutAddressManager } from '@/hooks/use-checkout-address-manager';
import { usePayment } from '@/hooks/use-payment';
import { useToast } from '@/hooks/use-toast';
import AddressCreateDialog from '@components/address/AddressCreateDialog';
import AddressSelectionModal from '@components/address/AddressSelectionModal';
import { CreateOrderRequest } from '@services/order.api';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import AddressSelection from './AddressSelection';
import CheckoutButton from './CheckoutButton';
import OrderResultModal from './OrderResultModal';
import PaymentMethodSelection from './PaymentMethodSelection';

export default function CartSummary({
  cartSummary,
  selectedItems,
  createOrder,
  isCreateOrder,
}: ReturnType<typeof useCart>) {
  const router = useRouter();
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

  const { showToast } = useToast();

  const [checkoutStep, setCheckoutStep] = useState<
    'initial' | 'creating' | 'processing' | 'redirecting' | 'payment_failed'
  >('initial');

  const {
    addresses,
    selectedAddress,
    isCreateOpen,
    isSelectionOpen,
    openSelectionDialog,
    openCreateFromSelection,
    closeDialogs,
    selectAddress,
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

  useEffect(() => {
    getPaymentMethods();
  }, [getPaymentMethods]);

  const isProcessing = useMemo(() => {
    if (checkoutStep === 'payment_failed') {
      return false;
    }

    if (checkoutStep === 'initial') {
      return isCreateOrder || isInitializingPayment;
    }

    return true;
  }, [checkoutStep, isCreateOrder, isInitializingPayment]);

  const canCheckout: boolean = Boolean(
    selectedItems &&
      selectedItems.length > 0 &&
      selectedAddress &&
      selectedPaymentMethodId &&
      !isProcessing,
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (checkoutStep === 'redirecting') {
      timeoutId = setTimeout(() => {
        if (checkoutStep === 'redirecting') {
          setCheckoutStep('payment_failed');
          showToast('Quá trình thanh toán bị gián đoạn. Vui lòng thử lại.', 'error');
        }
      }, 45000);
    }

    if (checkoutStep === 'processing') {
      timeoutId = setTimeout(() => {
        if (checkoutStep === 'processing') {
          setCheckoutStep('payment_failed');
          showToast('Quá trình xử lý bị gián đoạn. Vui lòng thử lại.', 'error');
        }
      }, 60000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [checkoutStep, showToast]);

  const validateOrder = (): string | null => {
    if (!selectedAddress) {
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
    clearPaymentError();

    const validationError = validateOrder();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    try {
      setCheckoutStep('creating');
      showToast('Đang bắt đầu quá trình thanh toán...', 'info');

      const orderPayload: CreateOrderRequest = {
        items: selectedItems,
        addressId: selectedAddress!.id,
      };

      const createdOrder = await createOrder(orderPayload);

      if (createdOrder) {
        setCreatedOrderId(createdOrder.orderId);
        setCheckoutStep('processing');
        showToast('Đơn hàng đã được tạo thành công!', 'success');

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const paymentPayload = {
          paymentMethodId: selectedPaymentMethodId!,
          paymentContent: 'Cam on seller',
          orderId: createdOrder.orderId,
        };

        setCheckoutStep('redirecting');
        showToast('Đang khởi tạo thanh toán...', 'info');

        try {
          const paymentUrl = await initPayment(paymentPayload);

          if (!paymentUrl || paymentUrl.trim() === '') {
            throw new Error('Không nhận được URL thanh toán từ server');
          }

          showToast('Đang chuyển hướng đến cổng thanh toán...', 'info');

          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 2000);
        } catch (paymentError: any) {
          setCheckoutStep('payment_failed');
          const errorMessage =
            paymentError.message || 'Không thể khởi tạo thanh toán. Vui lòng thử lại.';
          showToast(errorMessage, 'error');
          return;
        }
      } else {
        throw new Error('Không thể tạo đơn hàng');
      }
    } catch (error: any) {
      const currentStep = checkoutStep;

      if (currentStep === 'redirecting') {
        setCheckoutStep('payment_failed');
        showToast('Không thể khởi tạo thanh toán. Vui lòng thử lại.', 'error');
      } else if (currentStep === 'processing') {
        setCheckoutStep('payment_failed');
        showToast('Không thể chuẩn bị thanh toán. Vui lòng thử lại.', 'error');
      } else {
        setCheckoutStep('initial');
        setOrderSuccess(false);
        setShowOrderModal(true);
        showToast(error.message || 'Đã xảy ra lỗi trong quá trình tạo đơn hàng', 'error');
      }
    }
  };

  const handleRetryPayment = async () => {
    if (!createdOrderId || !selectedPaymentMethodId) {
      showToast('Thông tin đơn hàng không hợp lệ. Vui lòng thử lại từ đầu.', 'error');
      setCheckoutStep('initial');
      return;
    }

    clearPaymentError();

    try {
      setCheckoutStep('redirecting');
      showToast('Đang khởi tạo lại thanh toán...', 'info');

      const paymentPayload = {
        paymentMethodId: selectedPaymentMethodId,
        paymentContent: 'Cam on seller',
        orderId: createdOrderId,
      };

      const paymentUrl = await initPayment(paymentPayload);

      if (!paymentUrl || paymentUrl.trim() === '') {
        throw new Error('Không nhận được URL thanh toán từ server');
      }

      showToast('Đang chuyển hướng đến cổng thanh toán...', 'info');

      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 2000);
    } catch (error: any) {
      setCheckoutStep('payment_failed');
      const errorMessage = error.message || 'Không thể khởi tạo thanh toán. Vui lòng thử lại.';
      showToast(errorMessage, 'error');
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

  const handleForceReset = () => {
    setCheckoutStep('initial');
    setCreatedOrderId(null);
    clearPaymentError();
    showToast('Đã đặt lại trạng thái thanh toán', 'info');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <AddressSelection
        selectedAddress={selectedAddress}
        onOpenSelectionDialog={openSelectionDialog}
      />

      <PaymentMethodSelection
        paymentMethods={paymentMethods}
        selectedPaymentMethodId={selectedPaymentMethodId}
        isLoadingMethods={isLoadingMethods}
        paymentError={paymentError}
        onSelectPaymentMethod={selectPaymentMethod}
        onRetryGetPaymentMethods={() => getPaymentMethods()}
      />

      <CheckoutButton
        canCheckout={canCheckout}
        isProcessing={isProcessing}
        checkoutStep={checkoutStep}
        onCheckout={handleCheckout}
        onRetryPayment={handleRetryPayment}
        onForceReset={handleForceReset}
        selectedItems={selectedItems}
        cartSummary={cartSummary}
      />

      <OrderResultModal
        isOpen={showOrderModal}
        orderSuccess={orderSuccess}
        createdOrderId={createdOrderId}
        paymentError={paymentError}
        onClose={handleOrderModalClose}
      />

      <AddressSelectionModal
        open={isSelectionOpen}
        onClose={closeDialogs}
        onSelectAddress={selectAddress}
        onCreateNewAddress={openCreateFromSelection}
        addresses={addresses}
        selectedAddressId={selectedAddress?.id}
        loading={addressesLoading}
      />

      <AddressCreateDialog
        open={isCreateOpen}
        onClose={closeDialogs}
        onCreate={createAddress}
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
    </div>
  );
}
