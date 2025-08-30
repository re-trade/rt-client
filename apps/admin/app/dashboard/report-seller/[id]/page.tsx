'use client';

import AddEvidenceDialog from '@/components/report/AddEvidenceDialog';
import EvidenceTab from '@/components/report/EvidenceTab';
import OrderDetailsTab from '@/components/report/OrderDetailsTab';
import ProductDetailsTab from '@/components/report/ProductDetailsTab';
import ReportDetailsTab from '@/components/report/ReportDetailsTab';
import ReportHeader from '@/components/report/ReportHeader';
import ReportInfoCard from '@/components/report/ReportInfoCard';
import SellerInfoCard from '@/components/report/SellerInfoCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrderCombo } from '@/hooks/use-order-manager';
import {
  acceptReport,
  getEvidence,
  getProduct,
  getReportById,
  getSellerProfile,
  postEvidence,
  rejectReport,
  type TEvidence,
  type TProduct,
  type TReportSellerProfile,
  type TSellerProfile,
} from '@/services/report.seller.api';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
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

  const {
    orderCombo,
    loading: orderComboLoading,
    error: orderComboError,
    refetch: refetchOrderCombo,
  } = useOrderCombo(report?.orderId);

  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'processing' | 'success' | 'error'
  >('idle');

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

  const handleAddEvidence = async (data: {
    evidenceFiles: File[];
    evidenceUrls: string[];
    note: string;
  }) => {
    if (!reportId) return;

    setIsSubmitting(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      if (data.evidenceFiles.length > 0) {
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
        }, data.evidenceFiles.length * 400);
      } else {
        setUploadProgress(90);
        setUploadStatus('processing');
      }

      const result = await postEvidence(reportId, {
        evidenceFiles: data.evidenceFiles,
        evidenceUrls: data.evidenceUrls,
        note: data.note,
      });

      setUploadProgress(100);

      if (result.success) {
        setUploadStatus('success');
        toast.success('Bằng chứng đã được thêm thành công');
        setTimeout(() => {
          setEvidenceDialogOpen(false);
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
      <ReportHeader
        report={report}
        reportId={reportId || ''}
        processingAction={processingAction}
        onRefresh={fetchReportDetails}
        onAccept={handleAcceptReport}
        onReject={handleRejectReport}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <ReportInfoCard report={report} />
          <SellerInfoCard seller={seller} />
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6 bg-slate-100/80 p-1 rounded-lg shadow-sm">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Chi tiết tố cáo
              </TabsTrigger>
              <TabsTrigger
                value="evidence"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Bằng chứng
              </TabsTrigger>
              <TabsTrigger
                value="product"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sản phẩm
              </TabsTrigger>
              <TabsTrigger
                value="order"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Đơn hàng
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <ReportDetailsTab report={report} />
            </TabsContent>

            <TabsContent value="evidence">
              <EvidenceTab
                evidence={evidence}
                loading={evidenceLoading}
                onRefresh={fetchEvidenceData}
                onAddEvidence={() => setEvidenceDialogOpen(true)}
              />
            </TabsContent>

            <TabsContent value="product">
              <ProductDetailsTab product={product} formatDate={formatDate} />
            </TabsContent>

            <TabsContent value="order">
              <OrderDetailsTab
                orderCombo={orderCombo}
                loading={orderComboLoading}
                error={orderComboError}
                onRefresh={refetchOrderCombo}
                formatDate={formatDate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddEvidenceDialog
        open={evidenceDialogOpen}
        onOpenChange={(open) => {
          setEvidenceDialogOpen(open);
          if (!open) {
            setUploadStatus('idle');
            setUploadProgress(0);
          }
        }}
        onSubmit={handleAddEvidence}
        isSubmitting={isSubmitting}
        uploadProgress={uploadProgress}
        uploadStatus={uploadStatus}
      />
    </div>
  );
}
