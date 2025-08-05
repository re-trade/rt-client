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
import { TWithdrawProfile } from '@/services/withdraw.api';
import { AlertTriangle, Check, PauseCircle, Search, Store } from 'lucide-react';
import { useState } from 'react';

const statusLabels: Record<string, string> = {
  true: 'Đang hoạt động',
  false: 'Không hoạt động',
};

const statusColors: Record<string, string> = {
  true: 'bg-green-100 text-green-800',
  false: 'bg-red-100 text-yellow-800',
};

export default function WithdrawManagementPage() {
  const [selectedWithdraw, setSelectedWithdraw] = useState<TWithdrawProfile | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const {
    withdraws,
    loading,
    error,
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
    await fetchQr(withdraw.id);
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số yêu cầu</p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>
            <Store className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Yêu cầu đã thực hiện</p>
              <h2 className="text-2xl font-bold">{stats.verified}</h2>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Yêu cầu bị từ chối</p>
              <h2 className="text-2xl font-bold">{stats.rejected}</h2>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Yêu cầu đang chờ duyệt</p>
              <h2 className="text-2xl font-bold">{stats.pending}</h2>
            </div>
            <PauseCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
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

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian tạo</TableHead>
                <TableHead>Ngân hàng</TableHead>
                <TableHead>Bin</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdraws?.map((withdraw) => (
                <TableRow key={withdraw.id}>
                  <TableCell
                    className="font-medium w-[150px] max-w-[150px] truncate"
                    title={withdraw.id}
                  >
                    {withdraw.id}
                  </TableCell>
                  <TableCell className="font-medium">{withdraw.amount}</TableCell>
                  <TableCell>{withdraw.status}</TableCell>
                  <TableCell>
                    {new Date(withdraw.createdDate).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell>{withdraw.bankName}</TableCell>
                  <TableCell>{withdraw.bankBin}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(withdraw)}>
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
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
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={(currentPage + 1) * itemsPerPage >= stats.total}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>

      {selectedWithdraw && (
        <Dialog open={!!selectedWithdraw} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold">Chi tiết yêu cầu rút tiền</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết và trạng thái của yêu cầu rút tiền
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Status and Amount Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Store className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số tiền yêu cầu</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedWithdraw.amount.toLocaleString()} ₫
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">Trạng thái</p>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedWithdraw.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : selectedWithdraw.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {selectedWithdraw.status === 'PENDING' && '⏳ Đang chờ'}
                    {selectedWithdraw.status === 'APPROVED' && '✅ Đã duyệt'}
                    {selectedWithdraw.status === 'REJECTED' && '❌ Từ chối'}
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Thông tin yêu cầu
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      Mã yêu cầu
                    </div>
                    <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">
                      {selectedWithdraw.id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <PauseCircle className="h-4 w-4" />
                      Ngày tạo
                    </div>
                    <p className="font-medium">
                      {selectedWithdraw.createdDate
                        ? (() => {
                            const [year, month, day, hour, minute, second] =
                              selectedWithdraw.createdDate;
                            return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
                          })()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Bank Information */}
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Thông tin ngân hàng
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tên ngân hàng</p>
                        <p className="font-semibold text-lg">{selectedWithdraw.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Mã BIN</p>
                        <p className="font-mono text-sm bg-gray-50 p-2 rounded border inline-block">
                          {selectedWithdraw.bankBin}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Logo ngân hàng</p>
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
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Mã QR thanh toán
                  </h3>
                </div>
                <div className="p-4">
                  {qrError ? (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800">Lỗi khi tải mã QR</p>
                        <p className="text-sm text-red-700 mt-1">
                          {qrError === 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.'
                            ? qrError
                            : qrError || 'Không thể tải mã QR'}
                        </p>
                      </div>
                    </div>
                  ) : qrCodeUrl ? (
                    <div className="flex justify-center">
                      <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                        <img
                          src={qrCodeUrl || '/placeholder.svg'}
                          alt="QR Code thanh toán"
                          className="max-w-[250px] rounded"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Đang tải mã QR...</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="border-t pt-4 mt-6">
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={handleDialogClose}>
                  Đóng
                </Button>
                {selectedWithdraw.status === 'PENDING' && (
                  <Button
                    onClick={async () => {
                      if (selectedWithdraw) {
                        await handleApprove(selectedWithdraw.id);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
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
