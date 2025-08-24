'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import WithdrawDetailModal from '@/components/withdraw/WithdrawDetailModal';
import { useWithdrawManager } from '@/hooks/use-withdraw-manager';
import type { TWithdrawListItem } from '@/services/withdraw.api';
import { AlertTriangle, Check, Eye, PauseCircle, Search, Store } from 'lucide-react';
import { useState } from 'react';

const statusLabels: Record<string, string> = {
  '0': 'Yêu cầu đã thực hiện',
  PENDING: 'Đang chờ',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  COMPLETED: 'Hoàn thành',
};

const formatVietnameseDate = (dateInput: any): string => {
  try {
    let date: Date;

    if (Array.isArray(dateInput)) {
      const [year, month, day, hour, minute, second] = dateInput;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch (error) {
    return 'N/A';
  }
};

export default function WithdrawManagementPage() {
  const [selectedWithdraw, setSelectedWithdraw] = useState<TWithdrawListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    withdraws,
    page: currentPage,
    setPage: setCurrentPage,
    searchQuery,
    setSearchQuery,
    pageSize: itemsPerPage,
    stats,
    approveWithdraw,
    rejectWithdraw,
    fetchWithdrawQr,
    fetchWithdrawDetail,
    isApproving,
    isRejecting,
  } = useWithdrawManager();

  const handleViewDetails = async (withdraw: TWithdrawListItem) => {
    setSelectedWithdraw(withdraw);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWithdraw(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý rút tiền</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-gray-200 hover:shadow-lg shadow-md transition-all duration-300 bg-white">
          <div className="p-6 relative">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Tổng số yêu cầu</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</h2>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="h-1 w-full bg-blue-500"></div>
          </div>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-lg shadow-md transition-all duration-300 bg-white">
          <div className="p-6 relative">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Yêu cầu đã thực hiện</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{stats.verified}</h2>
              </div>
              <div className="p-2 rounded-full bg-green-50">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="h-1 w-full bg-green-500"></div>
          </div>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-lg shadow-md transition-all duration-300 bg-white">
          <div className="p-6 relative">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Yêu cầu bị từ chối</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{stats.rejected}</h2>
              </div>
              <div className="p-2 rounded-full bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="h-1 w-full bg-red-500"></div>
          </div>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-lg shadow-md transition-all duration-300 bg-white">
          <div className="p-6 relative">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Yêu cầu đang chờ duyệt</p>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</h2>
              </div>
              <div className="p-2 rounded-full bg-orange-50">
                <PauseCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="h-1 w-full bg-orange-500"></div>
          </div>
        </Card>
      </div>

      <Card className="border shadow bg-white">
        <div className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm yêu cầu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border shadow bg-white">
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Số tiền</TableHead>
                <TableHead className="font-semibold text-slate-700">Trạng thái</TableHead>
                <TableHead className="font-semibold text-slate-700">Thời gian tạo</TableHead>
                <TableHead className="font-semibold text-slate-700">Ngân hàng</TableHead>
                <TableHead className="font-semibold text-slate-700">Bin</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdraws?.map((withdraw, index) => (
                <TableRow
                  key={withdraw.id}
                  className="hover:bg-slate-50/50 transition-colors border-slate-100"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium text-gray-900">
                    {withdraw.amount.toLocaleString()} ₫
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        withdraw.status === 'PENDING'
                          ? 'bg-orange-100 text-orange-800'
                          : withdraw.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : withdraw.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusLabels[withdraw.status] || withdraw.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatVietnameseDate(withdraw.createdDate)}
                  </TableCell>
                  <TableCell className="text-gray-600">{withdraw.bankName}</TableCell>
                  <TableCell className="text-gray-600">{withdraw.bankBin}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 text-sm border border-orange-500 text-orange-600 rounded hover:bg-orange-500 hover:text-white transition-colors"
                      onClick={() => handleViewDetails(withdraw)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="border shadow bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {currentPage * itemsPerPage + 1} đến{' '}
              {Math.min((currentPage + 1) * itemsPerPage, withdraws.length)} trong tổng số{' '}
              {withdraws.length} yêu cầu
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="hover:bg-orange-50 hover:border-orange-300"
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={(currentPage + 1) * itemsPerPage >= stats.total}
                className="hover:bg-orange-50 hover:border-orange-300"
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <WithdrawDetailModal
        withdraw={selectedWithdraw}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={approveWithdraw}
        onReject={rejectWithdraw}
        fetchWithdrawQr={fetchWithdrawQr}
        fetchWithdrawDetail={fetchWithdrawDetail}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </div>
  );
}
