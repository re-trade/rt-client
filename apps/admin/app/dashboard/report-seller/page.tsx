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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useReportSeller } from '@/hooks/use-report-seller-manager';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  Filter,
  Package,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const ReportStats = ({ reports }: { reports: any[] }) => {
  const totalReports = reports.length;
  const verifiedReports = reports.filter((p) => p.resolutionStatus === 'ACCEPTED').length;
  const rejectedReports = reports.filter((p) => p.resolutionStatus === 'REJECTED').length;
  const pendingReports = reports.filter((p) => p.resolutionStatus === 'PENDING').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tổng số khách hàng</p>
            <p className="text-2xl font-bold">{totalReports}</p>
          </div>
          <Package className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
            <p className="text-2xl font-bold text-green-600">{verifiedReports}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đã từ chối</p>
            <p className="text-2xl font-bold text-green-600">{rejectedReports}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang chờ </p>
            <p className="text-2xl font-bold text-orange-600">{pendingReports}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
    </div>
  );
};

const AdvancedFilters = ({ searchQuery, onSearch, selectedCategory, setSelectedCategory }: any) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">Bộ lọc nâng cao</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            <SelectItem value="accepted">Đã xác minh</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

const ReporttDetailModal = ({
  report,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: {
  report: any;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
  onPending?: (id: string) => void;
}) => {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Thông tin tố cáo
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về tố cáo</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p>{report.reportSellerId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID khách hàng</p>
                <p>{report.customerId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                <p>{report.productId}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p>{report.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{report.sellerId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                <p>{new Date(report.resolutionDate).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>

        {report.resolutionStatus === 'PENDING' && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="text-green-600 border-green-600"
              onClick={() => onVerify && onVerify(report.reportSellerId)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Đồng ý tố cáo
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-600"
              onClick={() => onReject && onReject(report.reportSellerId)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Từ chối tố cáo
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ReportActions = ({ report, onVerify, onReject, onView }: any) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => onView(report)}>
        <Eye className="h-4 w-4" />
      </Button>

      {report.resolutionStatus === 'PENDING' && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVerify(report.reportSellerId)}
            className="text-green-600 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onReject(report.reportSellerId)}
            className="text-red-600 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default function ReportManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const {
    reports = [],
    page,
    maxPage,
    totalReports,
    loading,
    error,
    refetch,
    goToPage,
    searchReports,
    acceptReport,
    rejectReport,
  } = useReportSeller();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchReports(query);
  };

  const handlePageChange = (newPage: number) => {
    goToPage(newPage, searchQuery);
  };

  const handleVerify = async (reportId: string) => {
    const result = await acceptReport(reportId);
    if (result.success) {
      setDeleteSuccess('Xác minh sản phẩm thành công!');
    } else {
      setDeleteError(result.message || 'Lỗi xác minh sản phẩm');
    }
  };

  const handleReject = async (reportId: string) => {
    const result = await rejectReport(reportId);
    if (result.success) {
      setDeleteSuccess('Hủy xác minh sản phẩm thành công!');
    } else {
      setDeleteError(result.message || 'Lỗi hủy xác minh sản phẩm');
    }
  };

  const handleView = (report: any) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };
  const filteredReports = reports.filter((report) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      report.resolutionStatus.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesCategory;
  });

  return (
    <div className="space-y-6">
      {deleteSuccess && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Thành công:</span> {deleteSuccess}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteSuccess(null);
              }}
              className="text-green-600 hover:text-green-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {(error || deleteError) && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <div className="flex-1">
              <span className="font-medium">Lỗi:</span> {error || deleteError}
              {(error || deleteError)?.includes('đăng nhập') && (
                <div className="mt-2 text-sm">
                  <p>
                    Vui lòng đảm bảo bạn đã đăng nhập với tài khoản admin và có quyền thực hiện thao
                    tác này.
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    <strong>Lưu ý:</strong> Hệ thống sẽ tự động chuyển về trang đăng nhập sau 3
                    giây.
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteError(null);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <ReportStats reports={reports} />

      {/* Advanced Filters */}
      <AdvancedFilters
        searchQuery={searchQuery}
        onSearch={handleSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <Card className="p-6">
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Đang tải ...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p>Không tìm thấy tố cáo</p>
              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ID khách hàng</TableHead>
                  <TableHead>ID sản phẩm</TableHead>
                  <TableHead>ID đơn hàng</TableHead>
                  <TableHead>ID người bán</TableHead>
                  <TableHead>Loại tố cáo</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.reportSellerId}>
                    <TableCell className="font-medium">{report.reportSellerId}</TableCell>
                    <TableCell className="font-medium">{report.customerId}</TableCell>
                    <TableCell className="font-medium">{report.productId}</TableCell>
                    <TableCell className="font-medium">{report.orderId}</TableCell>
                    <TableCell className="font-medium">{report.sellerId}</TableCell>
                    <TableCell className="font-medium">{report.typeReport}</TableCell>
                    <TableCell className="font-medium">{report.content}</TableCell>
                    <TableCell className="font-medium">{report.resolutionStatus}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleView(report)}>
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && reports.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {reports.length} tố cáo trên trang {page} / {maxPage} (Tổng cộng{' '}
              {totalReports} tố cáo)
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {page} / {maxPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === maxPage}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ReporttDetailModal
        report={selectedReport}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReport(null);
        }}
        onVerify={async (id: string) => {
          const result = await acceptReport(id);
          if (result.success) setDeleteSuccess('Xác minh sản phẩm thành công!');
          else setDeleteError(result.message || 'Lỗi xác minh sản phẩm');
          setIsDetailModalOpen(false);
          setSelectedReport(null);
          refetch();
        }}
        onReject={async (id: string) => {
          const result = await rejectReport(id);
          if (result.success) setDeleteSuccess('Hủy xác minh sản phẩm thành công!');
          else setDeleteError(result.message || 'Lỗi hủy xác minh sản phẩm');
          setIsDetailModalOpen(false);
          setSelectedReport(null);
          refetch();
        }}
      />
    </div>
  );
}
