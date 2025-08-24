import { Card, CardContent } from '@/components/ui/card';
import { WithdrawHistoryResponse } from '@/service/wallet.api';
import {
  AlertCircle,
  Banknote,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  ShieldCheck,
  Timer,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface WithdrawDetailDialogProps {
  withdraw: WithdrawHistoryResponse;
  onClose: () => void;
}

export function WithdrawDetailDialog({ withdraw, onClose }: WithdrawDetailDialogProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/50',
          icon: <CheckCircle className="h-5 w-5" />,
          text: 'Hoàn thành',
          bgGradient: 'from-emerald-500/5 via-green-500/5 to-teal-500/5',
          glowColor: 'shadow-emerald-500/20',
        };
      case 'pending':
        return {
          color: 'bg-amber-500/10 text-amber-700 border-amber-200/50',
          icon: <Clock className="h-5 w-5" />,
          text: 'Đang xử lý',
          bgGradient: 'from-amber-500/5 via-yellow-500/5 to-orange-500/5',
          glowColor: 'shadow-amber-500/20',
        };
      case 'cancelled':
      case 'failed':
        return {
          color: 'bg-red-500/10 text-red-700 border-red-200/50',
          icon: <XCircle className="h-5 w-5" />,
          text: 'Thất bại',
          bgGradient: 'from-red-500/5 via-rose-500/5 to-pink-500/5',
          glowColor: 'shadow-red-500/20',
        };
      default:
        return {
          color: 'bg-gray-500/10 text-gray-700 border-gray-200/50',
          icon: <AlertCircle className="h-5 w-5" />,
          text: 'Không xác định',
          bgGradient: 'from-gray-500/5 via-slate-500/5 to-zinc-500/5',
          glowColor: 'shadow-gray-500/20',
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const statusConfig = getStatusConfig(withdraw.status);

  const BankIcon = ({ bankUrl, bankName }: { bankUrl?: string; bankName: string }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-blue-200/30 backdrop-blur-sm">
        {!imageError && bankUrl ? (
          <img
            src={bankUrl}
            alt={bankName}
            className="w-full h-full object-contain p-2 transition-all duration-300 hover:scale-105"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <Building2 className="w-8 h-8 text-blue-600/80" />
        )}
      </div>
    );
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in-0 duration-500"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[95vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        {/* Header với glassmorphism effect */}
        <div
          className={`px-8 py-6 bg-gradient-to-br ${statusConfig.bgGradient} border-b border-white/20 backdrop-blur-sm rounded-t-3xl relative overflow-hidden`}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                Chi tiết giao dịch
              </h3>
              <p className="text-sm text-gray-600/80 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                Thông tin chi tiết và bảo mật về giao dịch rút tiền
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-105 group backdrop-blur-sm border border-white/10"
            >
              <XCircle className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-1 space-y-6">
          {/* Status và Amount - Hero Section */}
          <div className="relative">
            <div
              className={`text-center  bg-gradient-to-br ${statusConfig.bgGradient} rounded-3xl border border-white/20 backdrop-blur-sm shadow-lg ${statusConfig.glowColor} relative overflow-hidden`}
            >
              <div className="relative z-10 space-y-6">
                {/* Status Badge */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-500/80 uppercase tracking-wider">
                    Trạng thái giao dịch
                  </div>
                  <div
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl border-2 shadow-lg backdrop-blur-sm ${statusConfig.color} ${statusConfig.glowColor} transition-all duration-300 hover:scale-105`}
                  >
                    <div className="relative">
                      {statusConfig.icon}
                      {withdraw.status.toLowerCase() === 'pending' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <span className="font-bold text-xl tracking-wide">{statusConfig.text}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-500/80 uppercase tracking-wider">
                    Số tiền rút
                  </div>
                  <div className="space-y-2">
                    <div className="text-6xl font-black text-gray-900 tracking-tight">
                      {withdraw.amount.toLocaleString('vi-VN')}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-200/30">
                      <Banknote className="h-4 w-4 text-blue-600" />
                      <span className="text-lg font-semibold text-blue-700">VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bank Information Card */}
            <div className="group">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-200/30">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Thông tin ngân hàng</h4>
                      <p className="text-sm text-gray-500">Chi tiết tài khoản nhận tiền</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50/50 to-white p-6 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-25 h-21 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <BankIcon bankUrl={withdraw.bankUrl} bankName={withdraw.bankName || ''} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <h5 className="font-bold text-gray-900 text-base break-words">
                          {withdraw.bankName}
                        </h5>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard className="h-6 w-6 flex-shrink-0 text-blue-500" />
                            <span className="font-bold text-xl bg-gray-100/50 px-2 py-1 rounded-lg">
                              {withdraw.accountNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Processing Timeline Card */}
            <div className="group">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-200/30">
                      <Timer className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Tiến trình xử lý</h4>
                      <p className="text-sm text-gray-500">Timeline của giao dịch</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Created Date */}
                    <div className="relative">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 rounded-xl border border-blue-200/30 backdrop-blur-sm">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg flex-shrink-0">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">
                            Ngày tạo yêu cầu
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {formatDate(withdraw.createdDate)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Completed Date */}
                    <div className="relative">
                      <div
                        className={`flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${withdraw.processedDate
                            ? 'bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 border-emerald-200/30'
                            : 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-amber-200/30'
                          }`}
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg flex-shrink-0 ${withdraw.processedDate
                              ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white'
                              : 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white'
                            }`}
                        >
                          {withdraw.processedDate ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-xs font-semibold mb-1 uppercase tracking-wider ${withdraw.processedDate ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                          >
                            Ngày hoàn thành
                          </div>
                          <div className="text-sm font-bold text-gray-900">
                            {withdraw.processedDate && withdraw.processedDate !== ''
                              ? formatDate(withdraw.processedDate)
                              : 'Đang xử lý...'}
                          </div>
                        </div>
                        {!withdraw.processedDate && (
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                              <div
                                className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"
                                style={{ animationDelay: '0.4s' }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Processing Duration */}
                    {withdraw.processedDate && withdraw.processedDate !== '' && (
                      <>
                        <div className="flex justify-center">
                          <div className="w-0.5 h-4 bg-gradient-to-b from-emerald-500 to-gray-300 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50/50 to-slate-50/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 text-white rounded-xl shadow-lg flex-shrink-0">
                            <Timer className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
                              Thời gian xử lý
                            </div>
                            <div className="text-sm font-bold text-gray-900">
                              {(() => {
                                const created = new Date(withdraw.createdDate);
                                const processed = new Date(withdraw.processedDate);
                                const diffInMs = processed.getTime() - created.getTime();
                                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                                const diffInHours = Math.floor(diffInMinutes / 60);
                                const diffInDays = Math.floor(diffInHours / 24);

                                if (diffInDays > 0) {
                                  return `${diffInDays} ngày ${diffInHours % 24} giờ`;
                                } else if (diffInHours > 0) {
                                  return `${diffInHours} giờ ${diffInMinutes % 60} phút`;
                                } else {
                                  return `${diffInMinutes} phút`;
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white rounded-b-3xl backdrop-blur-sm">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
