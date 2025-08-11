'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useReportSeller } from '@/hooks/use-report-seller-manager';
import type { TEvidence } from '@/services/report.seller.api';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Shield,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ReportStats = ({ reports }: { reports: any[] }) => {
  const totalReports = reports.length;
  const verifiedReports = reports.filter((p) => p.resolutionStatus === 'ACCEPTED').length;
  const rejectedReports = reports.filter((p) => p.resolutionStatus === 'REJECTED').length;
  const pendingReports = reports.filter((p) => p.resolutionStatus === 'PENDING').length;

  const stats = [
    {
      title: 'Tổng số tố cáo',
      value: totalReports,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Đã duyệt',
      value: verifiedReports,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Đã từ chối',
      value: rejectedReports,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
    },
    {
      title: 'Đang chờ',
      value: pendingReports,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdvancedFilters = ({ searchQuery, onSearch, selectedCategory, setSelectedCategory }: any) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">Bộ lọc nâng cao</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm tố cáo..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 h-11"
            />
          </div> */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="accepted">Đã xác minh</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

const ReportDetailModal = ({
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
}) => {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-blue-600" />
            Thông tin tố cáo
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về tố cáo</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  ID Tố cáo
                </p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">
                  {report.id}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  ID Khách hàng
                </p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                  {report.customerId}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  ID Sản phẩm
                </p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                  {report.productId}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  ID Đơn hàng
                </p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded border">{report.orderId}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  ID Người bán
                </p>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded border">{report.sellerId}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Loại tố cáo
                </p>
                <Badge variant="secondary" className="text-sm">
                  {report.typeReport}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Nội dung
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{report.content}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Ngày tạo
                </p>
                <p className="text-sm bg-gray-50 p-2 rounded border">
                  {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Trạng thái
                </p>
                <Badge
                  variant={
                    report.resolutionStatus === 'ACCEPTED'
                      ? 'default'
                      : report.resolutionStatus === 'REJECTED'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className="text-sm"
                >
                  {report.resolutionStatus === 'ACCEPTED'
                    ? 'Đã xác minh'
                    : report.resolutionStatus === 'REJECTED'
                      ? 'Đã từ chối'
                      : 'Chờ duyệt'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {report.resolutionStatus === 'PENDING' && (
          <>
            <Separator />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                onClick={() => onVerify && onVerify(report.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Đồng ý tố cáo
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                onClick={() => onReject && onReject(report.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối tố cáo
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ReportActions = ({ report, onVerify, onReject, onView }: any) => {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={() => onView(report)} className="h-8 w-8 p-0">
        <Eye className="h-4 w-4" />
      </Button>
      {report.resolutionStatus === 'PENDING' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVerify(report.id)}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReject(report.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

const EvidenceDetailModal = ({
  evidence,
  isOpen,
  onClose,
  reportId,
  onEvidenceUpdate,
}: {
  evidence: TEvidence[] | null;
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onEvidenceUpdate: (newEvidence: TEvidence[]) => void;
}) => {
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const [newEvidence, setNewEvidence] = useState<{ evidenceUrls: string[]; note: string }>({
    evidenceUrls: [''],
    note: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    urls: boolean;
    note: boolean;
  }>({
    urls: false,
    note: false,
  });

  const { fetchEvidence, postEvidence, evidenceLoading } = useReportSeller();

  const handleImageClick = (url: string) => {
    setFullSizeImage(url);
  };

  const handleCloseFullSize = () => {
    setFullSizeImage(null);
  };

  const handleAddUrl = () => {
    setNewEvidence((prev) => ({
      ...prev,
      evidenceUrls: [...prev.evidenceUrls, ''],
    }));
  };

  const handleRemoveUrl = (index: number) => {
    setNewEvidence((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index),
    }));
  };

  const handleUrlChange = (index: number, value: string) => {
    setNewEvidence((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.map((url, i) => (i === index ? value : url)),
    }));
  };

  const handleNoteChange = (value: string) => {
    setNewEvidence((prev) => ({
      ...prev,
      note: value,
    }));
  };

  const handlePostEvidence = async () => {
    try {
      // Reset validation errors
      setValidationErrors({ urls: false, note: false });

      const errors = { urls: false, note: false };

      // Validation: Check if at least one URL is provided
      const validUrls = newEvidence.evidenceUrls.filter((url) => url.trim());
      if (validUrls.length === 0) {
        errors.urls = true;
      }

      // Validation: Check if note is provided
      if (!newEvidence.note.trim()) {
        errors.note = true;
      }

      // If there are validation errors, set them and return
      if (errors.urls || errors.note) {
        setValidationErrors(errors);
        return;
      }

      const result = await postEvidence(reportId, {
        evidenceUrls: validUrls,
        note: newEvidence.note.trim(),
      });

      if (result.success) {
        toast.success('Thêm bằng chứng thành công!', {
          description: 'Bằng chứng đã được thêm vào báo cáo',
        });
        setNewEvidence({ evidenceUrls: [''], note: '' });
        setValidationErrors({ urls: false, note: false });
        setIsAddEvidenceOpen(false);

        const updatedEvidence = await fetchEvidence(reportId);
        onEvidenceUpdate(updatedEvidence);
      } else {
        toast.error('Không thể thêm bằng chứng', {
          description: result.message || 'Có lỗi xảy ra khi thêm bằng chứng',
        });
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra', {
        description: error.message || 'Không thể thêm bằng chứng vào lúc này',
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="h-6 w-6 text-blue-600" />
              Chi tiết bằng chứng
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về bằng chứng cho báo cáo ID: {reportId}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between items-center">
            <Button
              onClick={() => setIsAddEvidenceOpen(true)}
              disabled={!reportId}
              className="mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm bằng chứng
            </Button>
          </div>

          {evidence && Array.isArray(evidence) && evidence.length > 0 ? (
            <div className="space-y-6">
              {evidence.map((item, index) => (
                <Card key={item.id || index} className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            ID
                          </p>
                          <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">
                            {item.id || 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Vai trò người gửi
                          </p>
                          <Badge variant="outline">{item.senderRole || 'N/A'}</Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            Tên người gửi
                          </p>
                          <p className="text-sm bg-gray-50 p-2 rounded border">
                            {item.senderName || 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            ID người gửi
                          </p>
                          <p className="font-mono text-sm bg-gray-50 p-2 rounded border break-all">
                            {item.senderId || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Ghi chú
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="whitespace-pre-wrap text-sm">
                            {item.notes || 'Không có ghi chú'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Hình ảnh/Video
                        </p>
                        {Array.isArray(item.evidenceUrls) && item.evidenceUrls.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {item.evidenceUrls.map((url, urlIndex) => {
                              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i.test(url);
                              return isImage ? (
                                <div key={urlIndex} className="relative group">
                                  <img
                                    src={url || '/placeholder.svg'}
                                    alt={`Bằng chứng ${urlIndex + 1}`}
                                    className="w-full h-32 object-cover rounded-lg cursor-pointer border hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                                    onClick={() => handleImageClick(url)}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const nextSibling = e.currentTarget.nextElementSibling;
                                      if (nextSibling instanceof HTMLElement) {
                                        nextSibling.style.display = 'block';
                                      }
                                    }}
                                  />
                                  <p className="text-red-600 text-sm mt-1 hidden text-center">
                                    Không thể tải hình ảnh
                                  </p>
                                </div>
                              ) : (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate block p-3 border rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                  {url}
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                            <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>Không có bằng chứng</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không có dữ liệu bằng chứng</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full size image modal */}
      <Dialog open={!!fullSizeImage} onOpenChange={handleCloseFullSize}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <VisuallyHidden>
            <DialogTitle>Hình ảnh toàn màn hình</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            {fullSizeImage && (
              <img
                src={fullSizeImage || '/placeholder.svg'}
                alt="Hình ảnh toàn màn hình"
                className="w-full h-auto max-h-[95vh] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextSibling = e.currentTarget.nextElementSibling;
                  if (nextSibling instanceof HTMLElement) {
                    nextSibling.style.display = 'block';
                  }
                }}
              />
            )}
            <p className="text-red-600 text-sm mt-1 hidden text-center">Không thể tải hình ảnh</p>
            <button
              onClick={handleCloseFullSize}
              className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 hover:bg-black/90 transition-colors"
              aria-label="Đóng hình ảnh toàn màn hình"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add evidence modal */}
      <Dialog
        open={isAddEvidenceOpen}
        onOpenChange={(open) => {
          setIsAddEvidenceOpen(open);
          if (!open) {
            setNewEvidence({ evidenceUrls: [''], note: '' });
            setValidationErrors({ urls: false, note: false });
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm bằng chứng mới</DialogTitle>
            <DialogDescription>
              Nhập các URL bằng chứng và ghi chú cho báo cáo ID: {reportId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                URLs bằng chứng: <span className="text-red-500">*</span>
              </label>
              {newEvidence.evidenceUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Nhập URL bằng chứng (ví dụ: https://example.com/image.jpg)"
                      value={url}
                      onChange={(e) => {
                        handleUrlChange(index, e.target.value);
                        // Clear validation error when user starts typing
                        if (validationErrors.urls && e.target.value.trim()) {
                          setValidationErrors((prev) => ({ ...prev, urls: false }));
                        }
                      }}
                      className={`${validationErrors.urls ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {validationErrors.urls && index === 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        Vui lòng nhập ít nhất một URL bằng chứng
                      </p>
                    )}
                  </div>
                  {newEvidence.evidenceUrls.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUrl(index)}
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddUrl} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Thêm URL
              </Button>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Ghi chú: <span className="text-red-500">*</span>
              </label>
              <div>
                <Input
                  placeholder="Nhập ghi chú về bằng chứng"
                  value={newEvidence.note}
                  onChange={(e) => {
                    handleNoteChange(e.target.value);
                    // Clear validation error when user starts typing
                    if (validationErrors.note && e.target.value.trim()) {
                      setValidationErrors((prev) => ({ ...prev, note: false }));
                    }
                  }}
                  className={`${validationErrors.note ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {validationErrors.note && (
                  <p className="text-red-500 text-sm mt-1">Vui lòng nhập ghi chú về bằng chứng</p>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <Button
                onClick={handlePostEvidence}
                disabled={evidenceLoading || !reportId}
                className="flex-1"
              >
                {evidenceLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi bằng chứng'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddEvidenceOpen(false)}
                disabled={evidenceLoading}
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function ReportManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<TEvidence[] | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

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
    fetchEvidence,
  } = useReportSeller();

  const handleEvidenceUpdate = (newEvidence: TEvidence[]) => {
    setSelectedEvidence(newEvidence);
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
    if (result) {
      toast.success('Xác minh tố cáo thành công!', {
        description: 'Tố cáo đã được xác minh và cập nhật trạng thái',
      });
    } else {
      toast.error('Lỗi xác minh tố cáo', {
        description: 'Không thể xác minh tố cáo vào lúc này',
      });
    }
  };

  const handleReject = async (reportId: string) => {
    const result = await rejectReport(reportId);
    if (result) {
      toast.success('Từ chối tố cáo thành công!', {
        description: 'Tố cáo đã được từ chối và cập nhật trạng thái',
      });
    } else {
      toast.error('Lỗi từ chối tố cáo', {
        description: 'Không thể từ chối tố cáo vào lúc này',
      });
    }
  };

  const handleView = (report: any) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleViewEvidence = async (reportId: string) => {
    try {
      const evidenceArray = await fetchEvidence(reportId);
      setSelectedEvidence(evidenceArray);
      setSelectedReport({ id: reportId });
      setIsEvidenceModalOpen(true);
    } catch (error) {
      console.error('Error fetching evidence:', error);
      toast.error('Lỗi khi tải bằng chứng', {
        description: 'Không thể tải dữ liệu bằng chứng vào lúc này',
      });
      setSelectedEvidence([]);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      report.resolutionStatus.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác minh</Badge>
        );
      case 'REJECTED':
        return <Badge variant="destructive">Đã từ chối</Badge>;
      default:
        return <Badge variant="secondary">Chờ duyệt</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Quản lý tố cáo người bán</h1>
            <p className="text-gray-600 text-lg">Xem và xử lý các tố cáo từ khách hàng</p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="lg"
            className="shadow-sm bg-transparent"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Làm mới
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <div className="flex-1">
                  <span className="font-semibold">Lỗi:</span> {error}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <ReportStats reports={reports} />

        {/* Filters */}
        <AdvancedFilters
          searchQuery={searchQuery}
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Reports Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Danh sách tố cáo</CardTitle>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Tổng cộng: {totalReports} tố cáo
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                  <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Nội dung tố cáo</TableHead>
                      <TableHead className="font-semibold">Loại tố cáo</TableHead>
                      <TableHead className="font-semibold">Trạng thái</TableHead>
                      <TableHead className="font-semibold">Ngày tạo</TableHead>
                      <TableHead className="font-semibold text-center">Hành động</TableHead>
                      <TableHead className="font-semibold text-center">Bằng chứng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium max-w-xs">
                            <div className="truncate" title={report.content}>
                              {report.content || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {report.typeReport || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(report.resolutionStatus)}</TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell className="text-center">
                            <ReportActions
                              report={report}
                              onVerify={handleVerify}
                              onReject={handleReject}
                              onView={handleView}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewEvidence(report.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Package className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="space-y-3">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
                            <p className="text-gray-500 text-lg">Không có tố cáo nào</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {filteredReports.length > 0 && (
                  <div className="mt-6 flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Hiển thị {(page - 1) * 10 + 1} - {Math.min(page * 10, totalReports)} trong số{' '}
                      {totalReports} tố cáo
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                      >
                        Trước
                      </Button>
                      <div className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-md font-medium">
                        {page} / {maxPage}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === maxPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <ReportDetailModal
          report={selectedReport}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onVerify={handleVerify}
          onReject={handleReject}
        />

        <EvidenceDetailModal
          evidence={selectedEvidence}
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
          reportId={selectedReport?.id || ''}
          onEvidenceUpdate={handleEvidenceUpdate}
        />
      </div>
    </div>
  );
}
