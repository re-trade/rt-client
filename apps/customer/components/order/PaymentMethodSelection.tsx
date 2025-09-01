'use client';

import { CreditCard, Receipt } from 'lucide-react';
import Image from 'next/image';

interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imgUrl: string;
}

interface PaymentMethodSelectionProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
  isLoadingMethods: boolean;
  isInitializingPayment: boolean;
  paymentError: string | null;
  onSelectPaymentMethod: (id: string) => void;
  onPayment: () => void;
  onRefreshStatus: () => void;
}

export default function PaymentMethodSelection({
  paymentMethods,
  selectedPaymentMethodId,
  isLoadingMethods,
  isInitializingPayment,
  paymentError,
  onSelectPaymentMethod,
  onPayment,
  onRefreshStatus,
}: PaymentMethodSelectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-orange-500" />
        Phương thức thanh toán
      </h2>

      {isLoadingMethods ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Đang tải phương thức thanh toán...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => onSelectPaymentMethod(method.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedPaymentMethodId === method.id
                  ? 'border-orange-300 bg-orange-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src={method.imgUrl}
                    alt={method.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">{method.name}</h4>
                  <p className="text-xs text-gray-600 truncate">{method.description}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedPaymentMethodId === method.id
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPaymentMethodId === method.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Error Display */}
      {paymentError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{paymentError}</p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <button
          onClick={onPayment}
          disabled={!selectedPaymentMethodId || isInitializingPayment}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
            !selectedPaymentMethodId || isInitializingPayment
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
          }`}
        >
          {isInitializingPayment ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Thanh toán ngay</span>
            </>
          )}
        </button>
        <button
          onClick={onRefreshStatus}
          disabled={isInitializingPayment}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
            isInitializingPayment
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>🔄 Kiểm tra lại</span>
        </button>
      </div>
    </div>
  );
}
