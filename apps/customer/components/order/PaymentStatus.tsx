'use client';

import { PaymentHistoryItem } from '@/services/payment.api';
import { CheckCircle, CreditCard, XCircle } from 'lucide-react';

interface PaymentStatusProps {
  paymentStatus: { paid: boolean; orderId: string } | null;
  isLoadingStatus: boolean;
  order: any;
  paymentHistory: PaymentHistoryItem[];
  orderId: string;
  refreshPaymentData: (orderId: string) => void;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
}

export default function PaymentStatus({
  paymentStatus,
  isLoadingStatus,
  order,
  paymentHistory,
  orderId,
  refreshPaymentData,
  formatPrice,
  formatDate,
}: PaymentStatusProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-orange-500" />
        Trạng thái thanh toán
      </h2>

      {isLoadingStatus ? (
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
        </div>
      ) : paymentStatus ? (
        <div className="space-y-4">
          {/* Status Display */}
          <div
            className={`p-4 rounded-lg border-2 ${
              paymentStatus.paid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {paymentStatus.paid ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <p
                  className={`text-lg font-bold ${
                    paymentStatus.paid ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {paymentStatus.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </p>
                <p className="text-sm text-gray-600">Mã đơn hàng: #{orderId.slice(0, 8)}...</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-bold text-gray-800">{formatPrice(order.grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái đơn hàng:</span>
                <span className="font-medium text-gray-800">{order.status}</span>
              </div>
              {paymentStatus.paid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian thanh toán:</span>
                  <span className="font-medium text-gray-800">
                    {paymentHistory.length > 0
                      ? formatDate(paymentHistory[paymentHistory.length - 1].paymentTime)
                      : 'Đã thanh toán'}
                  </span>
                </div>
              )}
            </div>

            {/* Status Message */}
            <div
              className={`mt-3 p-3 rounded-lg ${
                paymentStatus.paid
                  ? 'bg-green-100 border border-green-200'
                  : 'bg-red-100 border border-red-200'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  paymentStatus.paid ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {paymentStatus.paid
                  ? '✅ Thanh toán đã được xác nhận. Đơn hàng đang được xử lý.'
                  : '⚠️ Đơn hàng chưa được thanh toán. Vui lòng hoàn tất thanh toán để xử lý đơn hàng.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không thể tải trạng thái thanh toán</p>
          <button
            onClick={() => refreshPaymentData(orderId)}
            className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}
