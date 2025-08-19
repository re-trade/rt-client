'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRegistration } from '@/context/RegistrationContext';
import { CheckCircle, Clock, Home, Mail, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessStep() {
  console.log('SuccessStep component rendered!'); // Debug log
  const router = useRouter();
  const { resetForm } = useRegistration();
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Start countdown after component mounts
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          // Clean up form state and redirect to seller dashboard
          setTimeout(() => {
            resetForm();
            router.push('/dashboard');
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, resetForm]);

  const handleGoToDashboard = () => {
    setIsRedirecting(true);
    // Clean up form state before redirect
    resetForm();
    router.push('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-6">
        <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Chào mừng đến với ReTrade!</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            Cảm ơn bạn đã đăng ký trở thành người bán trên ReTrade. Chúng tôi đã nhận được thông tin
            của bạn và sẽ xem xét trong thời gian sớm nhất.
          </p>

          {/* Countdown and redirect info */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
            {isRedirecting ? (
              <div className="flex items-center justify-center gap-3 text-orange-700">
                <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Đang chuyển hướng đến bảng điều khiển...</span>
              </div>
            ) : (
              <div className="text-center text-orange-700">
                <p className="font-medium mb-2">Bạn sẽ được chuyển đến bảng điều khiển trong</p>
                <div className="text-2xl font-bold text-orange-600">{countdown}s</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="border-orange-200 shadow-sm">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Các bước tiếp theo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Chờ xét duyệt</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Chúng tôi sẽ xem xét hồ sơ của bạn trong vòng 24-48 giờ làm việc
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Nhận thông báo</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kết quả sẽ được gửi qua email và SMS đến thông tin bạn đã đăng ký
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bắt đầu bán hàng</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Sau khi được phê duyệt, bạn có thể đăng sản phẩm và bắt đầu kinh doanh
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Thông tin quan trọng
          </h3>
          <div className="space-y-3 text-blue-700 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong>Email xác nhận:</strong> Chúng tôi đã gửi email xác nhận đến địa chỉ bạn đã
                đăng ký. Vui lòng kiểm tra cả hộp thư spam/junk.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong>Thời gian xét duyệt:</strong> Thông thường mất 24-48 giờ làm việc. Trong
                trường hợp đặc biệt có thể kéo dài hơn.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                <strong>Hỗ trợ:</strong> Nếu có thắc mắc, vui lòng liên hệ hotline hoặc email hỗ trợ
                của chúng tôi.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-orange-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Thông tin liên hệ hỗ trợ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Hotline hỗ trợ</h4>
              <p className="text-orange-600 font-semibold text-lg">1900 1234</p>
              <p className="text-sm text-gray-600">Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Email hỗ trợ</h4>
              <p className="text-orange-600 font-semibold">support@retrade.vn</p>
              <p className="text-sm text-gray-600">Phản hồi trong 24 giờ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button
          onClick={handleGoToDashboard}
          disabled={isRedirecting}
          className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRedirecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Đang chuyển hướng...
            </>
          ) : (
            <>
              <Home className="w-5 h-5 mr-2" />
              Đi đến bảng điều khiển ngay
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
