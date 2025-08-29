'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  type TEvidence,
  type TProduct,
  type TReportSellerProfile,
  type TSellerProfile,
  acceptReport,
  getEvidence,
  getProduct,
  getReportById,
  getSellerProfile,
  postEvidence,
  rejectReport,
} from '@/services/report.seller.api';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Flag,
  Package,
  PlusCircle,
  RefreshCw,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Upload,
  User,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const reportId = Array.isArray(id) ? id[0] : id;

  const [report, setReport] = useState<TReportSellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidence, setEvidence] = useState<TEvidence[]>([]);
  const [product, setProduct] = useState<TProduct | null>(null);
  const [seller, setSeller] = useState<TSellerProfile | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Evidence dialog state
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>(['']);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'processing' | 'success' | 'error'
  >('idle');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const fetchReportDetails = useCallback(async () => {
    setLoading(true);
    try {
      const reportData = await getReportById(reportId || '');
      if (reportData) {
        setReport(reportData);

        if (reportData.productId) {
          const productData = await getProduct(reportData.productId);
          if (productData) {
            setProduct(productData);
          }
        }

        if (reportData.sellerId) {
          const sellerData = await getSellerProfile(reportData.sellerId);
          if (sellerData) {
            setSeller(sellerData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      toast.error('Không thể tải thông tin báo cáo');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  const fetchEvidenceData = useCallback(async () => {
    if (!reportId) return;

    setEvidenceLoading(true);
    try {
      const response = await getEvidence(reportId);
      if (response && response.success) {
        setEvidence(response.content || []);
      } else {
        setEvidence([]);
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      setEvidence([]);
    } finally {
      setEvidenceLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    fetchReportDetails();
  }, [fetchReportDetails]);

  useEffect(() => {
    if (activeTab === 'evidence') {
      fetchEvidenceData();
    }
  }, [activeTab, fetchEvidenceData]);

  const handleAddEvidence = async () => {
    if (!reportId) return;

    setIsSubmitting(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const filteredUrls = evidenceUrls.filter((url) => url.trim() !== '');
      if (selectedFiles.length > 0) {
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + Math.floor(Math.random() * 10);
          });
        }, 500);

        setTimeout(() => {
          setUploadStatus('processing');
        }, selectedFiles.length * 400);
      } else {
        setUploadProgress(90);
        setUploadStatus('processing');
      }

      const result = await postEvidence(reportId, {
        evidenceFiles: selectedFiles,
        evidenceUrls: filteredUrls,
        note: evidenceNote,
      });

      setUploadProgress(100);

      if (result.success) {
        setUploadStatus('success');
        toast.success('Bằng chứng đã được thêm thành công');
        setTimeout(() => {
          setEvidenceDialogOpen(false);
          setEvidenceNote('');
          setEvidenceUrls(['']);
          setSelectedFiles([]);
          fetchEvidenceData();
          setUploadStatus('idle');
          setUploadProgress(0);
        }, 1000);
      } else {
        setUploadStatus('error');
        toast.error('Không thể thêm bằng chứng');
      }
    } catch (error) {
      console.error('Error adding evidence:', error);
      setUploadStatus('error');
      toast.error('Đã xảy ra lỗi khi thêm bằng chứng');
    } finally {
      setIsSubmitting(false);
      if (uploadStatus === 'error') {
        setUploadProgress(0);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(newFiles);
      event.target.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleAddUrlField = () => {
    setEvidenceUrls([...evidenceUrls, '']);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...evidenceUrls];
    newUrls[index] = value;
    setEvidenceUrls(newUrls);
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = evidenceUrls.filter((_, i) => i !== index);
    if (newUrls.length === 0) {
      newUrls.push('');
    }
    setEvidenceUrls(newUrls);
  };

  const handleAcceptReport = async () => {
    if (!reportId) return;

    setProcessingAction('accept');
    try {
      const result = await acceptReport(reportId);
      if (result && result.success) {
        toast.success('Tố cáo đã được xác minh');
        fetchReportDetails();
      } else {
        toast.error('Không thể xác minh tố cáo');
      }
    } catch (error) {
      console.error('Error accepting report:', error);
      toast.error('Đã xảy ra lỗi khi xác minh tố cáo');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleRejectReport = async () => {
    if (!reportId) return;

    setProcessingAction('reject');
    try {
      const result = await rejectReport(reportId);
      if (result && result.success) {
        toast.success('Tố cáo đã bị từ chối');
        fetchReportDetails();
      } else {
        toast.error('Không thể từ chối tố cáo');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      toast.error('Đã xảy ra lỗi khi từ chối tố cáo');
    } finally {
      setProcessingAction(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Đã xác minh
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Chờ xử lý
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-9 w-64" />
        </div>

        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  // Error state - report not found
  if (!report) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết báo cáo</h1>
        </div>

        <Card className="p-12 text-center">
          <CardContent className="flex flex-col items-center justify-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy báo cáo</h2>
            <p className="text-gray-500 mb-6">Báo cáo không tồn tại hoặc đã bị xóa khỏi hệ thống</p>
            <Button onClick={() => router.push('/dashboard/report-seller')}>
              Quay lại danh sách báo cáo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.push('/dashboard/report-seller')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Chi tiết báo cáo</h1>
              {getStatusBadge(report.resolutionStatus)}
            </div>
            <p className="text-gray-500 text-sm">
              ID: <span className="font-mono">{reportId}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchReportDetails}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>

          {report.resolutionStatus === 'PENDING' && (
            <>
              <Button
                variant="outline"
                onClick={handleAcceptReport}
                disabled={processingAction === 'accept'}
                className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
              >
                {processingAction === 'accept' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Xác nhận xử lí
              </Button>

              <Button
                variant="outline"
                onClick={handleRejectReport}
                disabled={processingAction === 'reject'}
                className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                {processingAction === 'reject' ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Đóng
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Info Card */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center text-lg">
                <Flag className="h-5 w-5 mr-2 text-orange-500" />
                Thông tin báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-500 mb-1">Thời gian báo cáo</dt>
                  <dd className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {formatDate(report.createdAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500 mb-1">ID Khách hàng báo cáo</dt>
                  <dd className="font-mono bg-gray-50 p-2 rounded text-sm border break-all">
                    {report.customerId || 'N/A'}
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500 mb-1">Loại báo cáo</dt>
                  <dd>
                    <Badge variant="secondary" className="font-normal">
                      {report.typeReport || 'N/A'}
                    </Badge>
                  </dd>
                </div>

                <div>
                  <dt className="text-gray-500 mb-1">Trạng thái xử lý</dt>
                  <dd>{getStatusBadge(report.resolutionStatus)}</dd>
                </div>

                {report.resolutionDate && (
                  <div>
                    <dt className="text-gray-500 mb-1">Thời gian xử lý</dt>
                    <dd className="font-medium">{formatDate(report.resolutionDate)}</dd>
                  </div>
                )}

                {report.adminId && (
                  <div>
                    <dt className="text-gray-500 mb-1">ID Admin xử lý</dt>
                    <dd className="font-mono bg-gray-50 p-2 rounded text-sm border break-all">
                      {report.adminId}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-gray-500 mb-1">ID Đơn hàng</dt>
                  <dd className="font-mono bg-gray-50 p-2 rounded text-sm border break-all">
                    {report.orderId || 'N/A'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center text-lg">
                <Store className="h-5 w-5 mr-2 text-blue-500" />
                Thông tin người bán
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {seller ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {seller.avatarUrl &&
                    typeof seller.avatarUrl === 'string' &&
                    seller.avatarUrl.startsWith('http') ? (
                      <Image
                        src={seller.avatarUrl}
                        alt={seller.shopName}
                        width={50}
                        height={50}
                        className="rounded-full border object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-avatar.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center">
                        <Store className="h-6 w-6 text-gray-500" />
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium">{seller.shopName}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                        {seller.avgVote.toFixed(1)}
                        {seller.verified && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-xs"
                          >
                            Đã xác minh
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500 mb-1">ID Người bán</dt>
                      <dd className="font-mono bg-gray-50 p-2 rounded border break-all">
                        {seller.id}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-gray-500 mb-1">Email</dt>
                      <dd>{seller.email}</dd>
                    </div>

                    <div>
                      <dt className="text-gray-500 mb-1">Số điện thoại</dt>
                      <dd>{seller.phoneNumber || 'N/A'}</dd>
                    </div>

                    <div>
                      <dt className="text-gray-500 mb-1">Địa chỉ</dt>
                      <dd>
                        {seller.addressLine && `${seller.addressLine}, `}
                        {seller.ward && `${seller.ward}, `}
                        {seller.district && `${seller.district}, `}
                        {seller.state || 'N/A'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-gray-500 mb-1">Ngày tham gia</dt>
                      <dd>{formatDate(seller.createdAt)}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Store className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Không có thông tin người bán</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Chi tiết tố cáo</TabsTrigger>
              <TabsTrigger value="evidence">Bằng chứng</TabsTrigger>
              <TabsTrigger value="product">Sản phẩm</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg">Nội dung tố cáo</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{report.content}</p>

                  {report.image && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 mb-2">Ảnh bằng chứng:</p>
                      <div className="relative group overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={report.image}
                          alt="Bằng chứng báo cáo"
                          width={600}
                          height={400}
                          className="max-w-full object-contain"
                          unoptimized={true}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            // Show fallback message
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) {
                              fallback.classList.remove('hidden');
                            }
                          }}
                        />
                        <div className="hidden text-center py-4 text-gray-500">
                          Không thể tải ảnh bằng chứng
                        </div>
                      </div>
                    </div>
                  )}

                  {report.resolutionDetail && (
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-700 mb-2">Chi tiết xử lý:</h3>
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {report.resolutionDetail}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence">
              <Card>
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Bằng chứng</CardTitle>
                  <Button
                    onClick={() => setEvidenceDialogOpen(true)}
                    size="sm"
                    className="ml-auto bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Thêm bằng chứng
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  {evidenceLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <RefreshCw className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Đang tải bằng chứng...</p>
                      </div>
                    </div>
                  ) : evidence.length > 0 ? (
                    <div className="space-y-6">
                      {evidence.map((item, index) => (
                        <div key={item.id || index} className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {item.senderAvatarUrl &&
                              typeof item.senderAvatarUrl === 'string' &&
                              item.senderAvatarUrl.startsWith('http') ? (
                                <Image
                                  src={item.senderAvatarUrl}
                                  alt={item.senderName}
                                  width={36}
                                  height={36}
                                  className="rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder-avatar.jpg';
                                  }}
                                />
                              ) : (
                                <div className="w-[36px] h-[36px] bg-gray-200 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{item.senderName || 'N/A'}</p>
                                <p className="text-xs text-gray-500">{item.senderRole || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4">
                            <p className="text-gray-700 whitespace-pre-wrap mb-4">
                              {item.notes || 'Không có ghi chú'}
                            </p>

                            {item.evidenceUrls && item.evidenceUrls.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {item.evidenceUrls.map((url, urlIndex) => {
                                  // Validate URL and check if it's an image
                                  const isValidUrl =
                                    url && typeof url === 'string' && url.startsWith('http');
                                  const isImage =
                                    isValidUrl &&
                                    /\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i.test(url);

                                  return isValidUrl && isImage ? (
                                    <div key={urlIndex} className="relative group">
                                      <Image
                                        src={url}
                                        alt={`Bằng chứng ${urlIndex + 1}`}
                                        width={150}
                                        height={150}
                                        className="w-full h-[120px] object-cover rounded border hover:opacity-90 cursor-pointer"
                                        unoptimized={true}
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          const fallback = e.currentTarget.nextElementSibling;
                                          if (fallback) {
                                            fallback.classList.remove('hidden');
                                          }
                                        }}
                                      />
                                      <div className="hidden text-center py-6 text-gray-500 text-xs border rounded">
                                        Không thể tải ảnh
                                      </div>
                                    </div>
                                  ) : isValidUrl ? (
                                    <a
                                      key={urlIndex}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-sm truncate flex items-center justify-center p-3 border rounded hover:bg-blue-50"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Xem tệp
                                    </a>
                                  ) : (
                                    <div
                                      key={urlIndex}
                                      className="flex items-center justify-center p-3 border rounded bg-gray-50 text-gray-500 text-sm"
                                    >
                                      URL không hợp lệ
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-gray-700 font-medium mb-2">Chưa có bằng chứng</h3>
                      <p className="text-gray-500">
                        Không có bằng chứng nào được gửi cho báo cáo này
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="product">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg">Thông tin sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {product ? (
                    <div>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <div className="relative aspect-square rounded-md border overflow-hidden">
                            {product.thumbnail &&
                            typeof product.thumbnail === 'string' &&
                            product.thumbnail.startsWith('http') ? (
                              <Image
                                src={product.thumbnail}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized={true}
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-product.jpg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Package className="h-16 w-16 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="md:w-2/3">
                          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {product.condition || 'N/A'}
                            </Badge>
                            {product.verified && (
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                Đã xác minh
                              </Badge>
                            )}
                          </div>

                          <div className="text-2xl font-bold text-orange-600 mb-4">
                            {product.currentPrice.toLocaleString('vi-VN')}đ
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Mô tả ngắn:</p>
                              <p className="text-gray-700">{product.shortDescription}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">ID Sản phẩm:</p>
                                <p className="font-mono bg-gray-50 p-2 rounded border break-all">
                                  {product.id}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500 mb-1">Thương hiệu:</p>
                                <p>{product.brand || 'N/A'}</p>
                              </div>

                              <div>
                                <p className="text-gray-500 mb-1">Model:</p>
                                <p>{product.model || 'N/A'}</p>
                              </div>

                              <div>
                                <p className="text-gray-500 mb-1">Số lượng:</p>
                                <p>{product.quantity} sản phẩm</p>
                              </div>

                              <div>
                                <p className="text-gray-500 mb-1">Đánh giá:</p>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                  <span>{product.avgVote.toFixed(1)}</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-gray-500 mb-1">Ngày tạo:</p>
                                <p>{formatDate(product.createdAt)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <p className="text-sm font-medium text-gray-500 mb-2">Danh mục:</p>
                            <div className="flex flex-wrap gap-2">
                              {product.categories && product.categories.length > 0 ? (
                                product.categories.map((category) => (
                                  <Badge key={category.id} variant="outline" className="bg-gray-50">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {category.name}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-gray-500">Không có danh mục</span>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => router.push(`/dashboard/product/${product.id}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Xem chi tiết sản phẩm
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <h3 className="font-medium text-gray-700 mb-4">Mô tả chi tiết:</h3>
                        <div className="bg-gray-50 p-4 rounded-md border">
                          <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                        </div>
                      </div>

                      {product.productImages && product.productImages.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-medium text-gray-700 mb-4">Hình ảnh sản phẩm:</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {product.productImages.map((img, i) => {
                              const isValidUrl =
                                img && typeof img === 'string' && img.startsWith('http');
                              return (
                                isValidUrl && (
                                  <div
                                    key={i}
                                    className="relative aspect-square rounded-md border overflow-hidden"
                                  >
                                    <Image
                                      src={img}
                                      alt={`${product.name} - Ảnh ${i + 1}`}
                                      fill
                                      className="object-cover"
                                      unoptimized={true}
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder-product.jpg';
                                      }}
                                    />
                                  </div>
                                )
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-gray-700 font-medium mb-2">
                        Không có thông tin sản phẩm
                      </h3>
                      <p className="text-gray-500">
                        Sản phẩm không tồn tại hoặc đã bị xóa khỏi hệ thống
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Evidence Dialog */}
      <Dialog
        open={evidenceDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setEvidenceDialogOpen(false);
            setUploadStatus('idle');
            setUploadProgress(0);
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] md:max-w-[800px] p-6">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-orange-600">
              Thêm bằng chứng mới
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Tải lên hình ảnh hoặc thêm ghi chú làm bằng chứng cho báo cáo này.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-3">
              <Label htmlFor="note" className="text-base font-medium">
                Ghi chú
              </Label>
              <Textarea
                id="note"
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="Thêm ghi chú về bằng chứng này..."
                className="resize-none min-h-[120px] text-base p-3"
                rows={4}
              />
            </div>

            <div className="grid gap-3">
              <Label className="text-base font-medium">Tải lên hình ảnh/tài liệu</Label>
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="evidence-files"
              />
              <div
                ref={dropZoneRef}
                className={`border-2 border-dashed ${isSubmitting ? 'opacity-50 pointer-events-none' : ''} ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} rounded-lg p-8 text-center hover:border-orange-400 cursor-pointer transition-all duration-200`}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                onDragEnter={!isSubmitting ? handleDragEnter : undefined}
                onDragOver={!isSubmitting ? handleDragOver : undefined}
                onDragLeave={!isSubmitting ? handleDragLeave : undefined}
                onDrop={!isSubmitting ? handleDrop : undefined}
              >
                <Upload
                  className={`h-8 w-8 mx-auto mb-4 ${isDragging ? 'text-orange-600 scale-110' : 'text-orange-500'} transition-transform duration-200`}
                />
                <p className="font-medium text-lg mb-1">
                  Kéo thả file vào đây hoặc nhấp để tải lên
                </p>
                <p className="text-sm text-muted-foreground">
                  Hỗ trợ ảnh, PDF, Word (tối đa 10MB/file)
                </p>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm mb-2">
                      File đã chọn ({selectedFiles.length})
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      disabled={isSubmitting || uploadStatus !== 'idle'}
                      className="text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 disabled:opacity-50"
                      onClick={() => !isSubmitting && setSelectedFiles([])}
                    >
                      Xóa tất cả
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {file.type.startsWith('image/') ? (
                            <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center">
                              <Package className="h-5 w-5 text-orange-600" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          disabled={isSubmitting || uploadStatus !== 'idle'}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                          onClick={() =>
                            !isSubmitting &&
                            setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6 pt-4 border-t gap-3">
            {uploadStatus !== 'uploading' &&
              uploadStatus !== 'processing' &&
              uploadStatus !== 'success' && (
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[120px]"
                  onClick={() => {
                    setEvidenceDialogOpen(false);
                    setUploadStatus('idle');
                    setUploadProgress(0);
                  }}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              )}

            {uploadStatus === 'idle' || uploadStatus === 'error' ? (
              <Button
                size="lg"
                className="min-w-[180px] bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleAddEvidence}
                disabled={
                  isSubmitting ||
                  (evidenceNote.trim() === '' &&
                    selectedFiles.length === 0 &&
                    evidenceUrls.every((url) => url.trim() === ''))
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  <span>Thêm bằng chứng</span>
                </div>
              </Button>
            ) : (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {uploadStatus === 'uploading' && 'Đang tải lên...'}
                    {uploadStatus === 'processing' && 'Đang xử lý...'}
                    {uploadStatus === 'success' && 'Hoàn thành!'}
                  </span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      uploadStatus === 'success' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
