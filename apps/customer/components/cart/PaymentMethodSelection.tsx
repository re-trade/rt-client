'use client';

import Image from 'next/image';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
}

interface PaymentMethodSelectionProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string | null;
  isLoadingMethods: boolean;
  paymentError: string | null;
  onSelectPaymentMethod: (id: string) => void;
  onRetryGetPaymentMethods: () => void;
}

export default function PaymentMethodSelection({
  paymentMethods,
  selectedPaymentMethodId,
  isLoadingMethods,
  onSelectPaymentMethod,
}: PaymentMethodSelectionProps) {
  return (
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
                  <div className="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                    <Image
                      src={method.imgUrl}
                      alt={method.name}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-medium text-gray-800 truncate">
                      {method.name}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {method.description}
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
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
      </div>
    </div>
  );
}
