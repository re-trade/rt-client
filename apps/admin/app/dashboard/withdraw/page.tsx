'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWithdrawManager } from '@/hooks/use-withdraw-manager';
import type { TWithdrawProfile } from '@/services/withdraw.api';
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
  const [selectedWithdraw, setSelectedWithdraw] = useState<TWithdrawProfile | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const {
    withdraws,
    page: currentPage,
    setPage: setCurrentPage,
    searchQuery,
    setSearchQuery,
    pageSize: itemsPerPage,
    stats,
    approveWithdraw,
    fetchWithdrawQr,
  } = useWithdrawManager();

  const fetchQr = async (withdrawId: string) => {
    try {
      const qrBlob = await fetchWithdrawQr(withdrawId);
      if (!qrBlob) {
        throw new Error('No QR code data returned');
      }
      const url = URL.createObjectURL(qrBlob);
      setQrCodeUrl(url);
      return qrBlob;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch QR code';
      setQrError(errorMessage);
      return null;
    }
  };

  const handleViewDetails = async (withdraw: TWithdrawProfile) => {
    setSelectedWithdraw(withdraw);
    setQrCodeUrl(null);
    setQrError(null);
    if (withdraw.status !== '0' && withdraw.status !== 'COMPLETED') {
      await fetchQr(withdraw.id);
    }
  };

  const handleApprove = async (productId: string) => {
    const success = await approveWithdraw(productId);
    if (success) {
      setSelectedWithdraw(null);
      setQrCodeUrl(null);
      setQrError(null);
    }
  };

  const handleDialogClose = () => {
    setSelectedWithdraw(null);
    if (qrCodeUrl) {
      URL.revokeObjectURL(qrCodeUrl);
      setQrCodeUrl(null);
    }
    setQrError(null);
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

      {selectedWithdraw && (
        <Dialog open={!!selectedWithdraw} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-4 pb-8 border-b">
              <DialogTitle className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                Chi tiết yêu cầu rút tiền
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                Thông tin chi tiết và trạng thái của yêu cầu rút tiền
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-10 pt-8">
              {/* Status and Amount Header */}
              <div className="flex items-center justify-between p-10 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 shadow-lg">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">Số tiền yêu cầu</p>
                    <p className="text-5xl font-bold text-green-600">
                      {selectedWithdraw.amount.toLocaleString()} ₫
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-700 mb-4">Trạng thái</p>
                  <div
                    className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold shadow-lg ${
                      selectedWithdraw.status === 'PENDING'
                        ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                        : selectedWithdraw.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : selectedWithdraw.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 border-2 border-red-300'
                            : selectedWithdraw.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800 border-2 border-green-300'
                              : 'bg-gray-100 text-gray-800 border-2 border-gray-300'
                    }`}
                  >
                    {selectedWithdraw.status === 'PENDING' && '⏳ Đang chờ'}
                    {selectedWithdraw.status === 'APPROVED' && '✅ Đã duyệt'}
                    {selectedWithdraw.status === 'REJECTED' && '❌ Từ chối'}
                    {selectedWithdraw.status === 'COMPLETED' && '✅ Đã thanh toán'}
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <Card className="border-2 border-gray-200 shadow-lg bg-white">
                <div className="p-8 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                    </div>
                    Thông tin yêu cầu
                  </h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-lg font-medium text-gray-700">
                      <AlertTriangle className="h-5 w-5 text-blue-600" />
                      Mã yêu cầu
                    </div>
                    <p className="font-mono text-lg bg-gray-50 p-4 rounded-xl border-2 border-gray-200 break-all">
                      {selectedWithdraw.id}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-lg font-medium text-gray-700">
                      <PauseCircle className="h-5 w-5 text-orange-600" />
                      Ngày tạo
                    </div>
                    <p className="font-semibold text-gray-900 text-2xl">
                      {formatVietnameseDate(selectedWithdraw.createdDate)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Bank Information */}
              <Card className="border-2 border-gray-200 shadow-lg bg-white">
                <div className="p-8 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Store className="h-5 w-5 text-green-600" />
                    </div>
                    Thông tin ngân hàng
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-3">Tên ngân hàng</p>
                        <p className="font-semibold text-3xl text-gray-900">
                          {selectedWithdraw.bankName}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-3">Mã BIN</p>
                        <p className="font-mono text-xl bg-gray-50 p-4 rounded-xl border-2 border-gray-200 inline-block">
                          {selectedWithdraw.bankBin}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-4">Logo ngân hàng</p>
                      {selectedWithdraw.bankUrl ? (
                        <div className="flex items-center justify-center p-4 bg-white border-2 border-dashed border-gray-200 rounded-lg">
                          <img
                            src={selectedWithdraw.bankUrl || '/placeholder.svg'}
                            alt={`${selectedWithdraw.bankName} Logo`}
                            className="max-w-[120px] max-h-[60px] object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                          <div className="text-center">
                            <Store className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Không có logo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* QR Code Section */}
              <Card className="border-2 border-gray-200 shadow-lg bg-white">
                <div className="p-8 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Search className="h-5 w-5 text-purple-600" />
                    </div>
                    Mã QR thanh toán
                  </h3>
                </div>
                <div className="p-8">
                  {selectedWithdraw.status === 'COMPLETED' ? (
                    <div className="flex items-center justify-center p-12 bg-green-50 border-2 border-dashed border-green-300 rounded-xl">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-lg font-semibold text-green-700">Đã thanh toán</p>
                        <p className="text-sm text-green-600 mt-1">Giao dịch đã được hoàn tất</p>
                      </div>
                    </div>
                  ) : qrError ? (
                    <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-red-800 text-lg">Lỗi khi tải mã QR</p>
                        <p className="text-sm text-red-700 mt-2">
                          {qrError === 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                            ? qrError
                            : qrError || 'Không thể tải mã QR'}
                        </p>
                      </div>
                    </div>
                  ) : qrCodeUrl ? (
                    <div className="flex justify-center">
                      <div className="p-8 bg-white border-2 border-gray-200 rounded-2xl shadow-lg">
                        <img
                          src={qrCodeUrl || '/placeholder.svg'}
                          alt="QR Code thanh toán"
                          className="max-w-[400px] rounded-xl"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-lg font-medium text-gray-700">Đang tải mã QR...</p>
                        <p className="text-sm text-gray-500 mt-1">Vui lòng đợi trong giây lát</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="border-t-2 border-gray-200 pt-8 mt-10">
              <DialogFooter className="gap-6">
                <Button
                  variant="outline"
                  onClick={handleDialogClose}
                  className="px-8 py-4 text-lg border-2 border-gray-300 hover:bg-gray-50"
                >
                  Đóng
                </Button>
                {selectedWithdraw.status === 'PENDING' && (
                  <Button
                    onClick={async () => {
                      if (selectedWithdraw) {
                        await handleApprove(selectedWithdraw.id);
                      }
                    }}
                    className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
                  >
                    <Check className="h-5 w-5 mr-3" />
                    Xác nhận duyệt
                  </Button>
                )}
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
