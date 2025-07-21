'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
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
import { useReportSellerManager } from '@/hooks/use-report-seller-manager';
import { TReportSellerProfile } from '@/services/report.seller.api';
import { AlertTriangle, Search, Store, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const statusLabels: Record<string, string> = {
  true: 'Chấp nhận',
  false: 'Từ chối',
};

const statusColors: Record<string, string> = {
  true: 'bg-green-100 text-green-800',
  false: 'bg-red-100 text-yellow-800',
};

export default function ReportSellerManagementPage() {
  const [selectedReport, setSelectedReport] = useState<TReportSellerProfile | null>(null);
  const {
    reports,
    loading,
    error,
    page: currentPage,
    setPage: setCurrentPage,
    searchQuery,
    setSearchQuery,
    pageSize: itemsPerPage,
    stats,
    approveReport,
  } = useReportSellerManager();

  if (loading) return <div>Loading sellers...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleViewDetails = (report: TReportSellerProfile) => {
    setSelectedReport(report);
  };

  // const handleToggleStatus = async (seller: TReportSellerProfile) => {
  //   const success = seller.verified ? await banSeller(seller.id) : await unbanSeller(seller.id);
  //   if (success) {
  //     setSelectedSeller(null);
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý tố cáo</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng số tố cáo</p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </div>
            <Store className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tố cáo đã được chấp nhận</p>
              <h2 className="text-2xl font-bold">{stats.accepted}</h2>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tố cáo bị từ chối</p>
              <h2 className="text-2xl font-bold">{stats.rejected}</h2>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tố cáo đang chờ duyệt</p>
              <h2 className="text-2xl font-bold">{stats.pending}</h2>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm ..."
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
                <TableHead>ID Người mua</TableHead>
                <TableHead>ID Sản phẩm</TableHead>
                <TableHead>ID Đơn hàng</TableHead>
                <TableHead>Thể loại</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((report) => (
                <TableRow key={report.id}>
                  <TableCell
                    className="font-medium w-[150px] max-w-[150px] truncate"
                    title={report.id}
                  >
                    {report.id}
                  </TableCell>
                  <TableCell className="font-medium">{report.customerId}</TableCell>
                  <TableCell className="font-medium">{report.productId}</TableCell>
                  <TableCell className="font-medium">{report.orderId}</TableCell>
                  <TableCell className="font-medium">{report.typeReport}</TableCell>
                  <TableCell className="font-medium">{report.content}</TableCell>
                  <TableCell className="font-medium">{report.resolutionStatus}</TableCell>

                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(report)}>
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
            {Math.min((currentPage + 1) * itemsPerPage, reports.length)} trong tổng số{' '}
            {reports.length} tố cáo
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

      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Chi tiết tố cáo</DialogTitle>
              {/* <DialogDescription>Thông tin chi tiết của người bán</DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID</p>
                    <p>{selectedReport.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tên người bán</p>
                    <p>{selectedReport.customerId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                    <p>{selectedReport.productId}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                    <p>{selectedReport.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{selectedReport.sellerId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                    <p>{new Date(selectedReport.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                    <p>{new Date(selectedReport.resolutionDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter>
                <Button
                  className={
                    selectedReport.resolutionStatus
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }
                  onClick={() => console.log('clicked')}
                >
                  {selectedReport.resolutionStatus ? 'Vô hiệu hóa người bán' : 'Xác thực người bán'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
