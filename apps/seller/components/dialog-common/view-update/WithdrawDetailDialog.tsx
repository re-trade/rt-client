import { WithdrawHistoryResponse } from '@/service/wallet.api';
import { AlertCircle, Building2, Calendar, CheckCircle, Clock, Hash, XCircle } from 'lucide-react';
interface WithdrawDetailDialogProps {
  withdraw: WithdrawHistoryResponse;
  onClose: () => void;
}

export function WithdrawDetailDialog({ withdraw, onClose }: WithdrawDetailDialogProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Hoàn thành',
        };
      case 'pending':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock className="h-4 w-4" />,
          text: 'Đang xử lý',
        };
      case 'cancelled':
      case 'failed':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <XCircle className="h-4 w-4" />,
          text: 'Thất bại',
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <AlertCircle className="h-4 w-4" />,
          text: 'Không xác định',
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
    });
  };
  const statusConfig = getStatusConfig(withdraw.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết giao dịch</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Status */}
          <div className="text-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}
            >
              {statusConfig.icon}
              <span className="font-medium">{statusConfig.text}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {withdraw.amount.toLocaleString('vi-VN')}₫
            </div>
            <div className="text-sm text-gray-500">Số tiền rút</div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 mb-1">Mã giao dịch</div>
                <div className="font-mono text-sm text-gray-900 break-all">{withdraw.id}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-1">Thông tin ngân hàng</div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">Mã BIN:</span> {withdraw.bankBin || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">Tên ngân hàng:</span>{' '}
                    {withdraw.bankName || 'Không xác định'}
                  </div>
                  {withdraw.bankUrl && (
                    <div className="text-sm">
                      <a
                        href={withdraw.bankUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Xem thông tin ngân hàng
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-1">Thời gian xử lý</div>
                <div className="text-sm text-gray-900">{formatDate(withdraw.processedDate)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
