'use client';
import { WithdrawDetailDialog } from '@/components/dialog-common/view-update/WithdrawDetailDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWithdrawHistoryPagination } from '@/hooks/use-withdraw-history-pagination';
import { snipppetCode } from '@/service/snippetCode';
import { WithdrawHistoryResponse } from '@/service/wallet.api';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Hash,
  MoreVertical,
  TrendingDown,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Đã hoàn thành',
        dotColor: 'bg-emerald-500',
      };
    case 'pending':
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock className="h-4 w-4" />,
        text: 'Đang xử lý',
        dotColor: 'bg-amber-500',
      };
    case 'rejected':
    case 'failed':
      return {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: <XCircle className="h-4 w-4" />,
        text: 'Từ chối',
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

export function WithdrawHistoryActiveTab() {
  const {
    withdrawHistory,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPage,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,
    handleKeyPress,
  } = useWithdrawHistoryPagination();

  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawHistoryResponse | null>(null);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

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
          <p className="text-gray-600 mt-2">Quản lý và theo dõi các giao dịch rút tiền của bạn</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow className="border-b border-gray-200 hover:bg-transparent">
              <TableHead className="font-bold text-gray-800">Thông tin tài khoản</TableHead>
              <TableHead className="font-bold text-gray-800 text-right">Số tiền rút</TableHead>
              <TableHead className="font-bold text-gray-800">Ngày thực hiện</TableHead>
              <TableHead className="font-bold text-gray-800">Ngày xử lý</TableHead>
              <TableHead className="font-bold text-gray-800 text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-gray-800 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : withdrawHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    {searchTerm ? 'Không tìm thấy giao dịch nào' : 'Chưa có lịch sử rút tiền'}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              withdrawHistory.map((withdraw, index) => {
                const statusConfig = getStatusConfig(withdraw.status);
                return (
                  <TableRow
                    key={withdraw.id}
                    className={`hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100 group ${index === withdrawHistory.length - 1 ? 'border-b-0' : ''
                      }`}
                  >




                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-12 rounded-lg overflow-hidden border border-gray-200">
                            <BankIcon
                              bankUrl={withdraw.bankUrl}
                              bankName={withdraw.bankName || ''}
                            />
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
                    <TableCell className="text-right py-5">
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900">
                          {formatCurrency(withdraw.amount)}₫
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
                          <div
                            className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`}
                          ></div>
                          {statusConfig.text}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center py-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => setSelectedWithdraw(withdraw)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2 text-blue-600" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              console.log('Hủy giao dịch:', withdraw.id);
                            }}
                            className="cursor-pointer text-red-600 focus:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Huỷ giao dịch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && withdrawHistory.length > 0 && (
        <div className="border rounded-lg bg-white">
          <div className="p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPage}
              totalItems={total}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
              pageSizeOptions={[10, 20, 50]}
              className="text-gray-600"
            />
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
