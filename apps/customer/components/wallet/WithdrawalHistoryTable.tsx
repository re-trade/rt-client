import { WithdrawalRequest } from '@/services/wallet.api';
import {
  Ban,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Wallet,
  X,
} from 'lucide-react';
import React from 'react';

interface WithdrawalHistoryTableProps {
  withdrawals: WithdrawalRequest[];
  loading: boolean;
  page: number;
  totalItems: number;
  size: number;
  onPageChange: (page: number) => void;
  onCancelWithdrawal: (id: string) => Promise<boolean>;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
}

const WithdrawalHistoryTable: React.FC<WithdrawalHistoryTableProps> = ({
  withdrawals,
  loading,
  page,
  totalItems,
  size,
  onPageChange,
  onCancelWithdrawal,
  formatCurrency,
  formatDate,
}) => {
  const totalPages = Math.ceil(totalItems / size);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-orange-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'REJECTED':
        return <Ban className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6">
          <Download className="w-10 h-10 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có yêu cầu rút tiền</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Các yêu cầu rút tiền của bạn sẽ được hiển thị tại đây. Bắt đầu bằng cách tạo yêu cầu rút
          tiền đầu tiên.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ngân hàng
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ngày xử lý
              </th>
              <th className="py-4 px-6 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-5 px-6">
                  <div className="flex items-center">
                    {withdrawal.bankUrl ? (
                      <img
                        src={withdrawal.bankUrl}
                        alt={withdrawal.bankName}
                        className="w-10 h-10 mr-4 object-contain rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 mr-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-gray-800">{withdrawal.bankName}</span>
                      <p className="text-sm text-gray-500">Ngân hàng</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="font-bold text-lg text-gray-800">
                    {formatCurrency(withdrawal.amount)}
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeStyle(withdrawal.status)}`}
                  >
                    {getStatusIcon(withdrawal.status)}
                    <span className="ml-2">
                      {withdrawal.status === 'COMPLETED'
                        ? 'Hoàn thành'
                        : withdrawal.status === 'PENDING'
                          ? 'Đang xử lý'
                          : 'Đã từ chối'}
                    </span>
                  </span>
                </td>
                <td className="py-5 px-6 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <div>
                      <div className="font-medium">{formatDate(withdrawal.processedDate)}</div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  {withdrawal.status === 'PENDING' && (
                    <button
                      onClick={() => onCancelWithdrawal(withdrawal.id)}
                      className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                      title="Hủy yêu cầu"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Hủy
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Hiển thị {page * size + 1}-{Math.min((page + 1) * size, totalItems)} trong{' '}
              <span className="font-bold text-gray-900">{totalItems}</span> kết quả
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`p-2 rounded-lg transition-all duration-200 ${
                page === 0
                  ? 'text-gray-400 cursor-not-allowed bg-gray-200'
                  : 'text-gray-700 hover:bg-gray-200 bg-white shadow-sm border border-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700 font-semibold bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-300">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className={`p-2 rounded-lg transition-all duration-200 ${
                page >= totalPages - 1
                  ? 'text-gray-400 cursor-not-allowed bg-gray-200'
                  : 'text-gray-700 hover:bg-gray-200 bg-white shadow-sm border border-gray-300'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawalHistoryTable;
