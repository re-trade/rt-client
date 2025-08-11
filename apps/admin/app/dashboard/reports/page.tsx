'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Eye, RefreshCw, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useReportSeller } from '@/hooks/use-report-seller-manager';

function ReportDetailModal({
  report,
  isOpen,
  onClose,
}: {
  report: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!report) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết báo cáo</DialogTitle>
          <DialogDescription>Mã báo cáo: {report.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <b>Người báo cáo:</b> {report.customerId || '-'}
          </div>
          <div>
            <b>Người bị báo cáo:</b> {report.sellerId || '-'}
          </div>
          <div>
            <b>Lý do:</b> {report.typeReport || '-'}
          </div>
          <div>
            <b>Nội dung:</b> {report.content || '-'}
          </div>
          <div>
            <b>Thời gian:</b>{' '}
            {report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : '-'}
          </div>
          <div>
            <b>Trạng thái:</b> {report.resolutionStatus || '-'}
          </div>
          {report.image && (
            <div>
              <b>Bằng chứng:</b>
              <div className="mt-2">
                <img
                  src={report.image}
                  alt="Bằng chứng báo cáo"
                  className="max-w-full h-auto rounded-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    console.error('Error loading image:', report.image);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportManagementPage() {
  const {
    reports,
    page,
    maxPage: totalPages,
    totalReports,
    loading,
    error,
    goToPage,
    refetch,
  } = useReportSeller();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleView = (report: any) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý báo cáo người bán</h1>
          <p className="text-muted-foreground">Danh sách các báo cáo vi phạm từ người dùng</p>
        </div>
        <Button onClick={refetch} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Lỗi:</span> {error}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Đang tải báo cáo...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p>Không tìm thấy báo cáo</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Người báo cáo</TableHead>
                <TableHead className="min-w-[120px]">Người bị báo cáo</TableHead>
                <TableHead className="min-w-[120px]">Lý do</TableHead>
                <TableHead className="min-w-[200px]">Nội dung</TableHead>
                <TableHead className="min-w-[140px]">Thời gian</TableHead>
                <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                <TableHead className="min-w-[80px] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.customerId || '-'}</TableCell>
                  <TableCell>{report.sellerId || '-'}</TableCell>
                  <TableCell>{report.typeReport || '-'}</TableCell>
                  <TableCell className="truncate max-w-[240px]">{report.content || '-'}</TableCell>
                  <TableCell>
                    {report.createdAt ? new Date(report.createdAt).toLocaleString('vi-VN') : '-'}
                  </TableCell>
                  <TableCell>{report.resolutionStatus || '-'}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleView(report)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && reports.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {reports.length} báo cáo trên trang {page} / {totalPages} (Tổng cộng{' '}
              {totalReports} báo cáo)
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ReportDetailModal
        report={selectedReport}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReport(null);
        }}
      />
    </div>
  );
}