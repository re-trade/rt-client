'use client';

import { PaymentHistoryItem } from '@/services/payment.api';
import { CreditCard, History } from 'lucide-react';
import Image from 'next/image';

interface PaymentHistoryProps {
  paymentHistory: PaymentHistoryItem[];
  isLoadingHistory: boolean;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
  getPaymentStatusColor: (status: string) => string;
  getPaymentStatusText: (status: string) => string;
}

export default function PaymentHistory({
  paymentHistory,
  isLoadingHistory,
  formatPrice,
  formatDate,
  getPaymentStatusColor,
  getPaymentStatusText,
}: PaymentHistoryProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-orange-500" />
        Lịch sử thanh toán
      </h2>

      {isLoadingHistory ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : paymentHistory.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {paymentHistory.map((payment, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 flex-shrink-0">
                  {payment.paymentMethodIcon ? (
                    <Image
                      src={payment.paymentMethodIcon}
                      alt={payment.paymentMethodName}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain rounded"
                    />
                  ) : (
                    <CreditCard className="w-full h-full text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-800">{payment.paymentMethodName}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}
                    >
                      {getPaymentStatusText(payment.paymentStatus)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{payment.paymentContent}</p>
                  <p className="text-xs text-gray-500">{formatDate(payment.paymentTime)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatPrice(payment.paymentTotal)}</p>
                  {payment.paymentCode && (
                    <p className="text-xs text-gray-500 mt-1">#{payment.paymentCode}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có lịch sử thanh toán</p>
        </div>
      )}
    </div>
  );
}
