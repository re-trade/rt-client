'use client';
import { WithdrawDetailDialog } from '@/components/dialog-common/view-update/WithdrawDetailDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { snipppetCode } from '@/service/snippetCode';
import { WithdrawHistoryResponse, walletApi } from '@/service/wallet.api';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Hash,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

export function WithdrawHistoryActiveTab() {
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistoryResponse[]>([]);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawHistory = async () => {
      try {
        setIsLoading(true);
        const history = await walletApi.getWithdrawHistory();
        setWithdrawHistory(history);
      } catch (error) {
        console.error('Error fetching withdraw history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Lịch sử rút tiền</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Lịch sử rút tiền</h3>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và theo dõi các giao dịch rút tiền của bạn
          </p>
        </div>
        <div className="text-sm text-gray-500">Tổng: {withdrawHistory.length} giao dịch</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold text-gray-700 py-4">Mã giao dịch</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Số tiền</TableHead>
              <TableHead className="font-semibold text-gray-700">Ngân hàng</TableHead>
              <TableHead className="font-semibold text-gray-700">Ngày xử lý</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">Trạng thái</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawHistory.map((withdraw, index) => {
              const statusConfig = getStatusConfig(withdraw.status);
              return (
                <TableRow
                  key={withdraw.id}
                  className={`hover:bg-gray-50/50 transition-colors border-b border-gray-100 ${
                    index === withdrawHistory.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="font-mono text-sm font-medium text-blue-600">
                        {snipppetCode.cutCode(withdraw.id)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-bold text-lg text-gray-900">
                        {withdraw.amount.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-gray-600">₫</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{withdraw.bankBin || 'N/A'}</div>
                        <div className="text-xs text-gray-500">
                          {withdraw.bankName || 'Không xác định'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(withdraw.processedDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.color}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.text}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <button
                      onClick={() => setSelectedWithdraw(withdraw)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Xem
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {withdrawHistory.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="max-w-sm mx-auto">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử rút tiền</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Các giao dịch rút tiền của bạn sẽ được hiển thị ở đây. Bạn có thể theo dõi trạng thái
              và chi tiết từng giao dịch.
            </p>
          </div>
        </div>
      )}

      {selectedWithdraw && (
        <WithdrawDetailDialog
          withdraw={selectedWithdraw}
          onClose={() => setSelectedWithdraw(null)}
        />
      )}
    </div>
  );
}
