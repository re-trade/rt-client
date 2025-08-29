'use client';

import MetricCard from '@/components/dashboard/MetricCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Flag,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Shield,
  TrendingUp,
  Upload,
  X,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
      color: 'from-blue-500 to-blue-600',
      trend: 'neutral' as const,
      change: 'Toàn bộ tố cáo',
    },
    {
      title: 'Đã duyệt',
      value: verifiedReports,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: 'up' as const,
      change: `${Math.round((verifiedReports / totalReports) * 100) || 0}% tổng số`,
    },
    {
      title: 'Đã từ chối',
      value: rejectedReports,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      trend: 'down' as const,
      change: `${Math.round((rejectedReports / totalReports) * 100) || 0}% tổng số`,
    },
    {
      title: 'Đang chờ',
      value: pendingReports,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      trend: 'neutral' as const,
      change: `${Math.round((pendingReports / totalReports) * 100) || 0}% tổng số`,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          change={stat.change}
        />
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
  const [activeTab, setActiveTab] = useState<'details' | 'evidence'>('details');
  const [evidenceData, setEvidenceData] = useState<TEvidence[] | null>(null);
  const [evidenceLoading, setEvidenceLoading] = useState<boolean>(false);
  const { fetchEvidence } = useReportSeller();

  useEffect(() => {
    if (isOpen && report && activeTab === 'evidence') {
      loadEvidence();
    }
  }, [isOpen, report, activeTab]);

  const loadEvidence = async () => {
    if (!report?.id) return;

    setEvidenceLoading(true);
    try {
      const evidenceArray = await fetchEvidence(report.id);
      setEvidenceData(evidenceArray);
    } catch (error) {
      console.error('Error loading evidence:', error);
      setEvidenceData([]);
    } finally {
      setEvidenceLoading(false);
    }
  };

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

          {/* Tabs */}
          <div className="flex border-b space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 px-1 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Chi tiết tố cáo
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`pb-2 px-1 font-medium text-sm transition-colors flex items-center gap-1 ${
                activeTab === 'evidence'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Bằng chứng
              {evidenceLoading && <RefreshCw className="h-3 w-3 animate-spin ml-1" />}
            </button>
          </div>
        </DialogHeader>

        {activeTab === 'details' && (
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
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                    {report.orderId}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    ID Người bán
                  </p>
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                    {report.sellerId}
                  </p>
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
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            {evidenceLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <RefreshCw className="h-10 w-10 animate-spin text-blue-500 mx-auto" />
                  <p className="text-gray-600">Đang tải bằng chứng...</p>
                </div>
              </div>
            ) : evidenceData && evidenceData.length > 0 ? (
              <div className="space-y-6">
                {evidenceData.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{item.senderName || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{item.senderRole || 'N/A'}</p>
                        </div>
                        <Badge variant="outline">{new Date().toLocaleDateString('vi-VN')}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {item.notes || 'Không có ghi chú'}
                          </p>
                        </div>

                        {item.evidenceUrls && item.evidenceUrls.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                            {item.evidenceUrls.map((url, urlIndex) => {
                              const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i.test(url);
                              return isImage ? (
                                <div key={urlIndex} className="relative group">
                                  <img
                                    src={url || '/placeholder.svg'}
                                    alt={`Bằng chứng ${urlIndex + 1}`}
                                    className="w-full h-20 sm:h-24 object-cover rounded border cursor-pointer hover:opacity-90"
                                  />
                                </div>
                              ) : (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm truncate block p-2 border rounded hover:bg-blue-50"
                                >
                                  {url}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-lg">Chưa có bằng chứng cho tố cáo này</p>
              </div>
            )}
          </div>
        )}

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onView(report)}>
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </DropdownMenuItem>

          {report.resolutionStatus === 'PENDING' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onVerify(report.id)}
                className="text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Đồng ý tố cáo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onReject(report.id)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối tố cáo
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
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
  const [newEvidence, setNewEvidence] = useState<{
    evidenceUrls: string[];
    evidenceFiles: File[];
    note: string;
  }>({
    evidenceUrls: [''],
    evidenceFiles: [],
    note: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    urls: boolean;
    files: boolean;
    note: boolean;
  }>({
    urls: false,
    files: false,
    note: false,
  });

  const {
    fetchEvidence,
    postEvidence,
    evidenceLoading,
    isUploadingImage,
    evidencePage,
    evidenceMaxPage,
    totalEvidence,
    goToEvidencePage,
  } = useReportSeller();

  const handleImageClick = (url: string) => {
    setFullSizeImage(url);
  };

  const handleCloseFullSize = () => {
    setFullSizeImage(null);
  };

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files || []);
    setNewEvidence((prev) => ({ ...prev, evidenceFiles: files as File[] }));
    if (files.length > 0 && validationErrors.files) {
      setValidationErrors((prev) => ({ ...prev, files: false }));
    }
  };

  const handleNoteChange = (value: string) => {
    setNewEvidence((prev) => ({ ...prev, note: value }));
    if (value.trim() && validationErrors.note) {
      setValidationErrors((prev) => ({ ...prev, note: false }));
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    setNewEvidence((prev) => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.map((url, i) => (i === index ? value : url)),
    }));
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

  const handlePostEvidence = async () => {
    try {
      setValidationErrors({ urls: false, files: false, note: false });

      const errors = { urls: false, files: false, note: false };
      const validUrls = newEvidence.evidenceUrls.filter((url) => url.trim());

      if (!validUrls.length && !newEvidence.evidenceFiles.length && !newEvidence.note.trim()) {
        errors.urls = true;
        errors.files = true;
        errors.note = true;
      } else if (!newEvidence.note.trim()) {
        errors.note = true;
      }

      if (errors.urls || errors.files || errors.note) {
        setValidationErrors(errors);
        return;
      }

      const result = await postEvidence(reportId, {
        evidenceUrls: validUrls,
        evidenceFiles: newEvidence.evidenceFiles,
        note: newEvidence.note.trim(),
      });

      if (result.success) {
        toast.success('Thêm bằng chứng thành công!', {
          description: 'Bằng chứng đã được thêm vào báo cáo',
        });
        setNewEvidence({ evidenceUrls: [''], evidenceFiles: [], note: '' });
        setValidationErrors({ urls: false, files: false, note: false });
        setIsAddEvidenceOpen(false);

        const updatedEvidence = await fetchEvidence(reportId);
        onEvidenceUpdate(updatedEvidence);
      } else {
        toast.error('Không thể thêm bằng chứng', {
          description: result.message || 'Có lỗi xảy ra khi thêm bằng chứng',
        });
      }
    } catch (error: any) {
      toast.error('Lỗi khi thêm bằng chứng', {
        description: error.message || 'Có lỗi không xác định xảy ra',
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

            {totalEvidence > 0 && (
              <div className="text-sm text-gray-600">Tổng cộng: {totalEvidence} bằng chứng</div>
            )}
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

              {evidenceMaxPage > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Trang {evidencePage} / {evidenceMaxPage}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToEvidencePage(evidencePage - 1, reportId)}
                      disabled={evidencePage <= 1 || evidenceLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToEvidencePage(evidencePage + 1, reportId)}
                      disabled={evidencePage >= evidenceMaxPage || evidenceLoading}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : evidenceLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 text-lg">Đang tải bằng chứng...</p>
              <p className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không có dữ liệu bằng chứng
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Hiện tại chưa có bằng chứng nào được gửi cho báo cáo này. Bạn có thể thêm bằng chứng
                mới bằng cách nhấn nút "Thêm bằng chứng" ở trên.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => fetchEvidence(reportId)}
                  disabled={evidenceLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${evidenceLoading ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
                <Button
                  onClick={() => setIsAddEvidenceOpen(true)}
                  disabled={!reportId}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Thêm bằng chứng đầu tiên
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

      <Dialog
        open={isAddEvidenceOpen}
        onOpenChange={(open) => {
          setIsAddEvidenceOpen(open);
          if (!open) {
            setNewEvidence({ evidenceUrls: [''], evidenceFiles: [], note: '' });
            setValidationErrors({ urls: false, files: false, note: false });
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm bằng chứng mới</DialogTitle>
            <DialogDescription>
              Tải lên hình ảnh từ thiết bị hoặc nhập URL bằng chứng cho báo cáo ID: {reportId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Tải lên từ thiết bị: <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Chọn hình ảnh từ thiết bị của bạn</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Chọn tệp
                    </label>
                  </div>
                </div>
                {newEvidence.evidenceFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Đã chọn {newEvidence.evidenceFiles.length} tệp:
                    </p>
                    <div className="space-y-1">
                      {newEvidence.evidenceFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {validationErrors.files && (
                  <p className="text-red-500 text-sm mt-2">
                    Vui lòng chọn ít nhất một tệp hoặc nhập URL
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500 bg-white">HOẶC</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* <div className="space-y-3">
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
                        handleUrlChange(index, e.target.value)
                        if (validationErrors.urls && e.target.value.trim()) {
                          setValidationErrors((prev) => ({ ...prev, urls: false }))
                        }
                      }}
                      className={`${validationErrors.urls ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    />
                    {validationErrors.urls && index === 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        Vui lòng chọn tệp hoặc nhập ít nhất một URL bằng chứng
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
            </div> */}

            {/* Note Section */}
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
                disabled={evidenceLoading || isUploadingImage || !reportId}
                className="flex-1"
              >
                {evidenceLoading || isUploadingImage ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    {isUploadingImage ? 'Đang tải lên...' : 'Đang gửi...'}
                  </>
                ) : (
                  'Gửi bằng chứng'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddEvidenceOpen(false)}
                disabled={evidenceLoading || isUploadingImage}
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
  const router = useRouter();
  const [selectedEvidence, setSelectedEvidence] = useState<TEvidence[] | null>(null);

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

  // Removed handleView - using router now

  const handleViewEvidence = async (reportId: string) => {
    try {
      // Now we navigate to the detail page with evidence tab selected
      router.push(`/dashboard/report-seller/${reportId}?tab=evidence`);
    } catch (error) {
      console.error('Error navigating to report details:', error);
      toast.error('Lỗi khi chuyển hướng tới trang chi tiết báo cáo', {
        description: 'Không thể tải thông tin báo cáo vào lúc này',
      });
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200/50 shadow-sm">
              <Flag className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-1">
                Quản lý tố cáo người bán
              </h1>
              <p className="text-gray-600">Xem và xử lý các tố cáo từ khách hàng</p>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="lg" className="shadow-sm">
            <RefreshCw className="h-5 w-5 mr-2" />
            Làm mới
          </Button>
        </div>
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
      <div className="mb-8">
        <ReportStats reports={reports} />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <AdvancedFilters
          searchQuery={searchQuery}
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Reports Table */}
      <Card className="shadow-lg shadow-slate-200/50 border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-200/50 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Flag className="h-5 w-5 text-orange-600" />
                Danh sách tố cáo
              </CardTitle>
              <CardDescription className="text-slate-600">
                {totalReports > 0
                  ? `Quản lý và xử lý ${totalReports} tố cáo trong hệ thống`
                  : 'Không có tố cáo nào trong hệ thống'}
              </CardDescription>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Tổng cộng: {totalReports} tố cáo
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <RefreshCw className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
                <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50/50 select-none">
                    <TableHead className="font-semibold text-slate-700">Nội dung tố cáo</TableHead>
                    <TableHead className="font-semibold text-slate-700">Loại tố cáo</TableHead>
                    <TableHead className="font-semibold text-slate-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-slate-700">Ngày tạo</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right w-28">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate" title={report.content}>
                            <Button
                              variant="link"
                              className="p-0 h-auto font-normal text-left text-blue-600 hover:text-blue-800 hover:underline"
                              onClick={() => router.push(`/dashboard/report-seller/${report.id}`)}
                            >
                              {report.content || 'N/A'}
                            </Button>
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
                        <TableCell className="text-right">
                          <ReportActions
                            report={report}
                            onVerify={handleVerify}
                            onReject={handleReject}
                            onView={() => router.push(`/dashboard/report-seller/${report.id}`)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
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
                <div className="mt-6 flex justify-between items-center p-4 border-t">
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
                    <div className="px-4 py-2 text-sm bg-orange-100 text-orange-800 rounded-md font-medium">
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

      {/* Removed modal in favor of detail page */}
    </div>
  );
}
