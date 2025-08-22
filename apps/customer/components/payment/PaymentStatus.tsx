'use client';

import { useToast } from '@/context/ToastContext';
import { usePayment } from '@/hooks/use-payment';
import { paymentApi, PaymentMethod, PaymentStatusResponse } from '@/services/payment.api';
import { AlertTriangle, Clock, CreditCard, Eye, RefreshCw, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PaymentStatusProps {
  orderId: string;
}

interface PaymentState {
  data: PaymentStatusResponse | null;
  isLoading: boolean;
  error: string | null;
}

const ERROR_MESSAGES = {
  FETCH_STATUS: 'Không thể tải trạng thái thanh toán',
  FETCH_METHODS: 'Không thể tải phương thức thanh toán',
  INIT_PAYMENT: 'Không thể khởi tạo thanh toán',
  NO_METHODS: 'Không có phương thức thanh toán khả dụng',
  GENERIC: 'Không thể tải thông tin thanh toán',
} as const;

const TOAST_MESSAGES = {
  REDIRECTING: 'Đang chuyển hướng đến trang thanh toán...',
} as const;

const LoadingSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-orange-200 rounded-lg"></div>
        <div className="h-6 bg-orange-200 rounded w-48"></div>
      </div>
      <div className="h-4 bg-orange-100 rounded w-full"></div>
      <div className="h-10 bg-orange-100 rounded w-32"></div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-red-100 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-red-600" />
      </div>
      <h2 className="text-lg font-bold text-gray-800">Lỗi tải trạng thái thanh toán</h2>
    </div>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Thử lại</span>
    </button>
  </div>
);

export default function PaymentStatus({ orderId }: PaymentStatusProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const { initPayment, getPaymentMethods, paymentMethods, isInitializingPayment } = usePayment();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>();

  const getErrorMessage = useCallback((error: any, fallback: string): string => {
    return error?.response?.data?.message || error?.message || fallback;
  }, []);

  const fetchPaymentStatus = useCallback(async () => {
    try {
      setPaymentState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await paymentApi.getPaymentStatus(orderId);
      setPaymentState((prev) => ({ ...prev, data, isLoading: false }));
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, ERROR_MESSAGES.FETCH_STATUS);
      setPaymentState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      showToast(errorMessage, 'error');
    }
  }, [orderId, showToast, getErrorMessage]);

  const processPayment = useCallback(
    async (paymentMethodId: string) => {
      try {
        const paymentUrl = await initPayment({
          paymentMethodId,
          paymentContent: `Thanh toán đơn hàng #${orderId}`,
          orderId: paymentState.data?.orderId || orderId,
        });

        if (!paymentUrl || paymentUrl.trim() === '') {
          throw new Error('Không nhận được URL thanh toán từ server');
        }

        window.open(paymentUrl, '_blank');
        showToast(TOAST_MESSAGES.REDIRECTING, 'info');
        setShowPaymentMethods(false);
        setTimeout(fetchPaymentStatus, 3000);
      } catch (error: any) {
        const errorMessage = error.message || ERROR_MESSAGES.INIT_PAYMENT;
        setShowPaymentMethods(false);
        showToast(errorMessage, 'error');
      }
    },
    [initPayment, orderId, paymentState.data?.orderId, showToast, fetchPaymentStatus],
  );
  const handlePayNowClick = useCallback(async () => {
    try {
      const methods = await getPaymentMethods();

      if (methods.length === 0) {
        showToast(ERROR_MESSAGES.NO_METHODS, 'warning');
        return;
      }

      if (methods.length > 1) {
        setShowPaymentMethods(true);
      } else {
        await processPayment(methods[0].id);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error, ERROR_MESSAGES.FETCH_METHODS);
      showToast(errorMessage, 'error');
    }
  }, [getPaymentMethods, processPayment, showToast, getErrorMessage]);

  const handlePaymentMethodSelect = useCallback(
    (methodId: string) => {
      processPayment(methodId);
    },
    [processPayment],
  );

  const closePaymentMethods = useCallback(() => {
    setShowPaymentMethods(false);
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchPaymentStatus();
    }
  }, [fetchPaymentStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closePaymentMethods();
      }
    };

    if (showPaymentMethods) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPaymentMethods, closePaymentMethods]);

  if (paymentState.data?.paid) {
    return null;
  }

  if (paymentState.isLoading) {
    return <LoadingSkeleton />;
  }

  if (paymentState.error || !paymentState.data) {
    return (
      <ErrorState
        error={paymentState.error || ERROR_MESSAGES.GENERIC}
        onRetry={fetchPaymentStatus}
      />
    );
  }

  const relatedCombos =
    paymentState.data.relatedComboIds?.filter((comboId) => comboId !== orderId) || [];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
      <PaymentHeader />

      <PendingPaymentStatus />

      <PaymentActionButton
        onPayNowClick={handlePayNowClick}
        isInitializingPayment={isInitializingPayment}
        showPaymentMethods={showPaymentMethods}
        paymentMethods={paymentMethods}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        onCloseModal={closePaymentMethods}
        modalRef={modalRef}
      />

      {relatedCombos.length > 0 && <RelatedCombos combos={relatedCombos} />}
    </div>
  );
}

const PaymentHeader = () => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-orange-100 rounded-lg">
      <CreditCard className="w-5 h-5 text-orange-600" />
    </div>
    <h2 className="text-lg font-bold text-gray-800">Thanh toán đơn hàng</h2>
  </div>
);

const PendingPaymentStatus = () => (
  <div className="mb-6">
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
      <div className="p-2 rounded-full bg-yellow-500">
        <Clock className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-yellow-800">Chờ thanh toán</h3>
        <p className="text-sm text-yellow-600">Đơn hàng đang chờ thanh toán</p>
      </div>
    </div>
  </div>
);

interface PaymentActionButtonProps {
  onPayNowClick: () => void;
  isInitializingPayment: boolean;
  showPaymentMethods: boolean;
  paymentMethods: PaymentMethod[];
  onPaymentMethodSelect: (methodId: string) => void;
  onCloseModal: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

const PaymentActionButton = ({
  onPayNowClick,
  isInitializingPayment,
  showPaymentMethods,
  paymentMethods,
  onPaymentMethodSelect,
  onCloseModal,
  modalRef,
}: PaymentActionButtonProps) => (
  <div className="mb-6 relative">
    <button
      onClick={onPayNowClick}
      disabled={isInitializingPayment}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isInitializingPayment ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          <span>Thanh toán ngay</span>
        </>
      )}
    </button>

    {/* Payment Method Selection Modal */}
    {showPaymentMethods && (
      <PaymentMethodModal
        paymentMethods={paymentMethods}
        onPaymentMethodSelect={onPaymentMethodSelect}
        onClose={onCloseModal}
        modalRef={modalRef}
      />
    )}
  </div>
);

interface PaymentMethodModalProps {
  paymentMethods: PaymentMethod[];
  onPaymentMethodSelect: (methodId: string) => void;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

const PaymentMethodModal = ({
  paymentMethods,
  onPaymentMethodSelect,
  onClose,
  modalRef,
}: PaymentMethodModalProps) => (
  <div
    ref={modalRef}
    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-orange-200 z-50"
  >
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">Chọn phương thức thanh toán</h4>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onPaymentMethodSelect(method.id)}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-orange-50 rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
          >
            {method.imgUrl && (
              <Image
                src={method.imgUrl}
                alt={method.name}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            )}
            <div>
              <p className="font-medium text-gray-800">{method.name}</p>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const RelatedCombos = ({ combos }: { combos: string[] }) => (
  <div>
    <h3 className="font-semibold text-gray-800 mb-3">Đơn hàng liên quan</h3>
    <div className="space-y-2">
      {combos.map((comboId) => (
        <div
          key={comboId}
          className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200"
        >
          <div>
            <p className="font-medium text-gray-800">#{comboId.slice(0, 8)}...</p>
            <p className="text-sm text-gray-600">Combo đơn hàng</p>
          </div>
          <Link href={`/user/purchase/${comboId}`}>
            <button className="flex items-center gap-2 px-3 py-2 bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200">
              <Eye className="w-4 h-4" />
              <span>Xem chi tiết</span>
            </button>
          </Link>
        </div>
      ))}
    </div>
  </div>
);
