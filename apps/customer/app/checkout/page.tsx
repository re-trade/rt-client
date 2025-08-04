'use client';

import {
  AlertCircle,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  Home,
  RotateCcw,
  ShoppingBag,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const getPaymentMethodInfo = (method: 'PAY_OS' | 'VN_PAY' | null) => {
  switch (method) {
    case 'PAY_OS':
      return {
        name: 'PayOS',
        fullName: 'PayOS Payment Gateway',
        logo: '💳',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        description: 'Thanh toán an toàn qua PayOS',
        features: ['Bảo mật cao', 'Xử lý nhanh chóng', 'Hỗ trợ đa ngân hàng'],
        supportInfo: {
          hotline: '1900 545 436',
          email: 'support@payos.vn',
          website: 'payos.vn',
        },
      };
    case 'VN_PAY':
      return {
        name: 'VNPay',
        fullName: 'VNPay Payment Gateway',
        logo: '🏦',
        color: 'from-red-500 to-red-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        description: 'Thanh toán qua VNPay - Cổng thanh toán hàng đầu Việt Nam',
        features: ['Uy tín cao', 'Kết nối 40+ ngân hàng', 'Bảo mật tuyệt đối'],
        supportInfo: {
          hotline: '1900 555 577',
          email: 'support@vnpay.vn',
          website: 'vnpay.vn',
        },
      };
    default:
      return {
        name: 'Thanh toán',
        fullName: 'Payment Gateway',
        logo: '💰',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
        description: 'Thanh toán trực tuyến',
        features: ['An toàn', 'Tiện lợi', 'Nhanh chóng'],
        supportInfo: {
          hotline: '1900 1234',
          email: 'support@retrade.vn',
          website: 'retrade.vn',
        },
      };
  }
};

const PaymentCompletion: React.FC = () => {
  const searchParams = useSearchParams();

  const status = searchParams.get('status');
  const method = searchParams.get('method');
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const bankCode = searchParams.get('bankCode');
  const payDate = searchParams.get('payDate');

  const isSuccess = status === 'true';
  const paymentMethod = method as 'PAY_OS' | 'VN_PAY' | null;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isSuccess) {
    return (
      <SuccessState
        paymentMethod={paymentMethod}
        orderId={orderId}
        transactionId={transactionId}
        amount={amount}
        bankCode={bankCode}
        payDate={payDate}
      />
    );
  } else {
    return (
      <FailureState
        paymentMethod={paymentMethod}
        orderId={orderId}
        amount={amount}
        bankCode={bankCode}
      />
    );
  }
};

const LoadingState: React.FC = () => (
  <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
    <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 text-center max-w-md w-full">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 animate-pulse" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Đang xử lý thanh toán</h2>
          <p className="text-gray-600 mb-4">Vui lòng chờ trong giây lát...</p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-orange-700">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Xác thực</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-300"></div>
                <span>Xử lý</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-200 rounded-full animate-pulse delay-700"></div>
                <span>Hoàn tất</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SuccessState: React.FC<{
  paymentMethod: 'PAY_OS' | 'VN_PAY' | null;
  orderId: string | null;
  transactionId: string | null;
  amount: string | null;
  bankCode: string | null;
  payDate: string | null;
}> = ({ paymentMethod, orderId, transactionId, amount, bankCode, payDate }) => {
  const methodInfo = getPaymentMethodInfo(paymentMethod);

  return (
    <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 text-center max-w-lg w-full">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 mb-6">
              Đơn hàng của bạn đã được thanh toán thành công qua {methodInfo.name}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Chi tiết giao dịch</h3>
              </div>

              <div className="space-y-3">
                {orderId && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Mã đơn hàng:
                    </span>
                    <span className="font-medium text-gray-800 font-mono">#{orderId}</span>
                  </div>
                )}

                {transactionId && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Mã giao dịch:
                    </span>
                    <span className="font-medium text-gray-800 font-mono">{transactionId}</span>
                  </div>
                )}

                {amount && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium text-green-600 text-lg">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(parseInt(amount))}
                    </span>
                  </div>
                )}

                {bankCode && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium text-gray-800 uppercase">{bankCode}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Thời gian:
                  </span>
                  <span className="font-medium text-gray-800">
                    {payDate
                      ? new Date(payDate).toLocaleString('vi-VN')
                      : new Date().toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Thành công
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/user/purchase"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Xem đơn hàng</span>
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Tiếp tục mua sắm</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FailureState: React.FC<{
  paymentMethod: 'PAY_OS' | 'VN_PAY' | null;
  orderId: string | null;
  amount: string | null;
  bankCode: string | null;
}> = ({ paymentMethod, orderId, amount, bankCode }) => {
  const methodInfo = getPaymentMethodInfo(paymentMethod);

  const handleRetryPayment = () => {
    if (orderId) {
      window.location.href = `/user/purchase/${orderId}`;
    } else {
      window.location.href = '/user/purchase';
    }
  };

  return (
    <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 text-center max-w-lg w-full">
            {/* Failure Icon */}
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-gray-600 mb-6">
              Đã có lỗi xảy ra trong quá trình thanh toán qua {methodInfo.name}. Vui lòng thử lại.
            </p>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${methodInfo.color} text-white rounded-lg mb-6`}
            >
              <span className="text-lg">{methodInfo.logo}</span>
              <span className="font-medium">{methodInfo.fullName}</span>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Lý do thất bại có thể</h3>
              </div>
              <p className="text-red-700 text-sm mb-3">
                Giao dịch qua {methodInfo.name} không thể hoàn tất. Nguyên nhân có thể:
              </p>
              <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                <li>Số dư tài khoản không đủ</li>
                <li>Thông tin thanh toán không chính xác</li>
                <li>Lỗi kết nối mạng hoặc timeout</li>
                <li>Phiên giao dịch đã hết hạn</li>
                <li>Ngân hàng từ chối giao dịch</li>
              </ul>
            </div>

            {(orderId || amount || bankCode) && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <X className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-gray-800">Thông tin giao dịch thất bại</h3>
                </div>

                <div className="space-y-3">
                  {orderId && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Mã đơn hàng:
                      </span>
                      <span className="font-medium text-gray-800 font-mono">#{orderId}</span>
                    </div>
                  )}

                  {amount && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-medium text-gray-800 text-lg">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(parseInt(amount))}
                      </span>
                    </div>
                  )}

                  {bankCode && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-medium text-gray-800 uppercase">{bankCode}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Thời gian thử:
                    </span>
                    <span className="font-medium text-gray-800">
                      {new Date().toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      <X className="w-4 h-4" />
                      Thất bại
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* ReTrade Support */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-3">Hỗ trợ ReTrade</h3>
                <div className="space-y-2 text-sm text-orange-700">
                  <p>📞 Hotline: 1900 1234</p>
                  <p>📧 Email: support@retrade.vn</p>
                  <p>⏰ 8:00 - 21:00 hàng ngày</p>
                </div>
              </div>

              <div
                className={`${methodInfo.bgColor} ${methodInfo.borderColor} border rounded-lg p-4`}
              >
                <h3 className={`font-semibold ${methodInfo.textColor} mb-3`}>
                  Hỗ trợ {methodInfo.name}
                </h3>
                <div className={`space-y-2 text-sm ${methodInfo.textColor}`}>
                  <p>📞 Hotline: {methodInfo.supportInfo.hotline}</p>
                  <p>📧 Email: {methodInfo.supportInfo.email}</p>
                  <p>🌐 Website: {methodInfo.supportInfo.website}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRetryPayment}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử lại thanh toán</span>
              </button>
              <Link
                href="/user/purchase"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Xem đơn hàng</span>
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Về trang chủ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for payment completion parameters
  const status = searchParams.get('status');
  const method = searchParams.get('method');

  if (status !== null && method !== null) {
    return <PaymentCompletion />;
  }

  useEffect(() => {
    router.push('/');
  }, [router]);
  return (
    <section className="bg-gradient-to-br from-orange-25 via-orange-50 to-orange-25 py-6 md:py-12 lg:py-20 min-h-screen">
      <div className="mx-auto max-w-screen-xl px-3 md:px-6 2xl:px-0">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-8 text-center max-w-md w-full">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Đang chuyển hướng</h2>
            <p className="text-gray-600">Đang chuyển về trang chủ...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
