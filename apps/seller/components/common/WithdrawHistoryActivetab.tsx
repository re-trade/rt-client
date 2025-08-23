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
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Hash,
  TrendingDown,
  User,
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
        dotColor: 'bg-emerald-500',
      };
    case 'pending':
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock className="h-4 w-4" />,
        text: 'Đang xử lý',
        dotColor: 'bg-amber-500',
      };
    case 'cancelled':
    case 'failed':
      return {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Thất bại',
        dotColor: 'bg-red-500',
      };
    default:
      return {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Không xác định',
        dotColor: 'bg-gray-500',
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

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('vi-VN');
};

const maskAccountNumber = (accountNumber: string) => {
  if (!accountNumber || accountNumber.length <= 6) return accountNumber;
  const start = accountNumber.slice(0, 3);
  const end = accountNumber.slice(-3);
  const middle = '*'.repeat(Math.min(4, accountNumber.length - 6));
  return `${start}${middle}${end}`;
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
        console.log('Withdraw history:', history);
        setWithdrawHistory(history);
      } catch (error) {
        console.error('Error fetching withdraw history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWithdrawHistory();
  }, []);

  const BankIcon = ({ bankUrl, bankName }: { bankUrl?: string; bankName: string }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div className="w-full h-full rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageError && bankUrl ? (
          <img
            src={bankUrl}
            alt={bankName}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <Building2 className="w-12 h-12 text-gray-400" />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
            Lịch sử rút tiền
          </h3>
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi các giao dịch rút tiền của bạn
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
          <strong>{withdrawHistory.length}</strong> giao dịch
        </div>
      </div>



      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow className="border-b border-gray-200 hover:bg-transparent">
              <TableHead className="font-bold text-gray-800 py-5">Mã giao dịch</TableHead>
              <TableHead className="font-bold text-gray-800 text-right">Số tiền rút</TableHead>
              <TableHead className="font-bold text-gray-800">Thông tin tài khoản</TableHead>
              <TableHead className="font-bold text-gray-800">Ngày rút</TableHead>
              <TableHead className="font-bold text-gray-800">Ngày hoàn thành</TableHead>
              <TableHead className="font-bold text-gray-800 text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-gray-800 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawHistory.map((withdraw, index) => {
              const statusConfig = getStatusConfig(withdraw.status);
              return (
                <TableRow
                  key={withdraw.id}
                  className={`hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100 group ${index === withdrawHistory.length - 1 ? 'border-b-0' : ''
                    }`}
                >
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Hash className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <span className="font-mono text-sm font-semibold text-blue-600 hover:text-blue-700">
                        {snipppetCode.cutCode(withdraw.id)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right py-5">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">
                        {formatCurrency(withdraw.amount)}₫
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-12 rounded-lg overflow-hidden border border-gray-200">
                          <BankIcon bankUrl={withdraw.bankUrl} bankName={withdraw.bankName || ''} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {withdraw.bankName || 'N/A'}
                          </div>
                          <div className="text-2xs text-black font-bold">
                            {withdraw.accountNumber || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(withdraw.createdDate).split(', ')[0]}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      {withdraw.processedDate && withdraw.processedDate !== '' ? (
                        <>
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(withdraw.processedDate).split(', ')[0]}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-amber-600" />
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-amber-600">
                              Đang xử lý...
                            </div>
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-5">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border shadow-sm ${statusConfig.color}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}></div>
                        {statusConfig.text}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center py-5">
                    <button
                      onClick={() => setSelectedWithdraw(withdraw)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl transition-all duration-200 hover:shadow-md transform hover:scale-105"
                    >
                      <Eye className="h-4 w-4" />
                      Chi tiết
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {withdrawHistory.length === 0 && (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
          <div className="max-w-sm mx-auto">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Wallet className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Chưa có lịch sử rút tiền</h3>
            <p className="text-gray-600 leading-relaxed">
              Các giao dịch rút tiền của bạn sẽ được hiển thị ở đây.<br />
              Bạn có thể theo dõi trạng thái và chi tiết từng giao dịch một cách dễ dàng.
            </p>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedWithdraw && (
        <WithdrawDetailDialog
          withdraw={selectedWithdraw}
          onClose={() => setSelectedWithdraw(null)}
        />
      )}
    </div>
  );
}