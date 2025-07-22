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
        return 'text-green-500';
      case 'PENDING':
        return 'text-yellow-500';
      case 'REJECTED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'REJECTED':
        return <Ban className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Download className="w-8 h-8 text-[#525252]" />
        </div>
        <h3 className="text-lg font-medium text-[#121212] mb-1">Chưa có yêu cầu rút tiền</h3>
        <p className="text-[#525252]">Các yêu cầu rút tiền của bạn sẽ được hiển thị tại đây.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-xs font-medium text-[#525252] uppercase tracking-wider">
                Ngân hàng
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#525252] uppercase tracking-wider">
                Số tiền
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#525252] uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-[#525252] uppercase tracking-wider">
                Ngày xử lý
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-[#525252] uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    {withdrawal.bankUrl ? (
                      <img
                        src={withdrawal.bankUrl}
                        alt={withdrawal.bankName}
                        className="w-8 h-8 mr-3 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 mr-3 bg-gray-200 rounded-md flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-[#525252]" />
                      </div>
                    )}
                    <span className="font-medium text-[#121212]">{withdrawal.bankName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 font-medium">{formatCurrency(withdrawal.amount)}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    {getStatusIcon(withdrawal.status)}
                    <span className={`ml-2 ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status === 'COMPLETED'
                        ? 'Hoàn thành'
                        : withdrawal.status === 'PENDING'
                          ? 'Đang xử lý'
                          : 'Đã từ chối'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#525252]">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(withdrawal.processedDate)}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  {withdrawal.status === 'PENDING' && (
                    <button
                      onClick={() => onCancelWithdrawal(withdrawal.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Hủy yêu cầu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-4 flex items-center justify-between border-t border-[#525252]/10">
          <div>
            <p className="text-sm text-[#525252]">
              Hiển thị {page * size + 1}-{Math.min((page + 1) * size, totalItems)} trong{' '}
              {totalItems} kết quả
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`p-2 rounded-md ${
                page === 0
                  ? 'text-[#525252]/50 cursor-not-allowed'
                  : 'text-[#525252] hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-[#525252] font-medium">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className={`p-2 rounded-md ${
                page >= totalPages - 1
                  ? 'text-[#525252]/50 cursor-not-allowed'
                  : 'text-[#525252] hover:bg-gray-100'
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
