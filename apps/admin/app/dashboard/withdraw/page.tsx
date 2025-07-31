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

export default function ShopManagementPage() {
  const [selectedWithdraw, setSelectedWithdraw] = useState<TWithdrawProfile | null>(null);
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
  } = useWithdrawManager();

  if (loading) return <div>Loading withdraws...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleViewDetails = (withdraw: TWithdrawProfile) => {
    setSelectedWithdraw(withdraw);
  };

  const handleApprove = async (productId: string) => {
    await approveWithdraw(productId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý người bán</h1>
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
                placeholder="Tìm kiếm cửa hàng..."
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
                  <TableCell>{withdraw.processedDate}</TableCell>
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
        <Dialog open={!!selectedWithdraw} onOpenChange={() => setSelectedWithdraw(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết người bán</DialogTitle>
              <DialogDescription>Thông tin chi tiết của người bán</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID</p>
                    <p>{selectedWithdraw.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên người bán</p>
                    <p>{selectedWithdraw.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                    <p>{selectedWithdraw.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                    <p>{selectedWithdraw.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                    <p>{new Date(selectedWithdraw.bankName).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                  <p>{new Date(selectedWithdraw.bankUrl).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              {!selectedWithdraw.status && (
                <Button
                  onClick={async () => {
                    if (selectedWithdraw) {
                      await handleApprove(selectedWithdraw.id);
                      setSelectedWithdraw(null); // Close dialog after approval
                    }
                  }}
                >
                  Xác nhận
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
