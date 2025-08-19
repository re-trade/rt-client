import { type OrderResponse, ordersApi } from '@/service/orders.api';
import { reportSellerApi, type SellerReportResponse } from '@/service/report.api';
import { storageApi } from '@/service/storage.api';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type EnhancedEvidenceResponse = {
  id: string;
  senderRole: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  notes: string;
  evidenceUrls: string[];
  createdAt?: string;
};

interface UseReportDetailProps {
  id: string;
}

export function useReportDetail({ id }: UseReportDetailProps) {
  const router = useRouter();

  const [report, setReport] = useState<SellerReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [orderDetails, setOrderDetails] = useState<OrderResponse | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);

  const [evidences, setEvidences] = useState<EnhancedEvidenceResponse[]>([]);
  const [evidenceLoading, setEvidenceLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [note, setNote] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const formatCreatedDate = useCallback((dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const reports = await reportSellerApi.getReportSellers(0, 100);
      const foundReport = reports.content.find((r) => r.id === id);
      if (foundReport) {
        setReport(foundReport);
        if (foundReport.orderId) {
          fetchOrderDetails(foundReport.orderId);
        } else {
          setOrderLoading(false);
        }
      } else {
        toast.error('Báo cáo không tồn tại hoặc đã bị xóa.');
        router.push('/dashboard/report');
      }
    } catch {
      toast.error('Không thể tải thông tin báo cáo.');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    setOrderLoading(true);
    try {
      const order = await ordersApi.getOrderComboById(orderId);
      if (order) {
        setOrderDetails(order);
      }
    } catch (_) {
      toast.error('Không thể tải thông tin đơn hàng.');
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const fetchEvidences = useCallback(async () => {
    setEvidenceLoading(true);
    try {
      const result = await reportSellerApi.getReportSellerEvidences(
        id,
        currentPage - 1,
        itemsPerPage,
      );
      const enhancedEvidences = result.content.map((evidence) => ({
        ...evidence,
        createdAt: evidence.createdAt || new Date().toISOString(),
      }));
      setEvidences(enhancedEvidences);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalElements);
    } catch {
      toast.error('Không thể tải bằng chứng.');
    } finally {
      setEvidenceLoading(false);
    }
  }, [id, currentPage, itemsPerPage]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => file.type.startsWith('image/'));

      if (validFiles.length !== newFiles.length) {
        toast.error('Chỉ chấp nhận file hình ảnh');
      }

      const combinedFiles = [...images, ...validFiles].slice(0, 5);
      setImages(combinedFiles);

      const urls = combinedFiles.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);
    },
    [images],
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);

      const newUrls = [...imageUrls];
      URL.revokeObjectURL(newUrls[index] ?? '');
      newUrls.splice(index, 1);
      setImageUrls(newUrls);
    },
    [images, imageUrls],
  );

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    try {
      const response = await storageApi.fileBulkUpload(files);
      return response.content || [];
    } catch {
      toast.error('Không thể tải lên hình ảnh. Vui lòng thử lại sau.');
      return [];
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!note.trim() && images.length === 0) {
      toast.error('Vui lòng nhập nội dung hoặc đính kèm hình ảnh.');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedUrls: string[] = [];

      if (images.length > 0) {
        uploadedUrls = await uploadImages(images);
      }

      const result = await reportSellerApi.sendSellerEvidence(id, note.trim(), uploadedUrls);

      if (result) {
        toast.success('Đã gửi phản hồi thành công.');

        setNote('');
        setImages([]);
        setImageUrls([]);

        await fetchEvidences();
      } else {
        throw new Error('Failed to send evidence');
      }
    } catch {
      toast.error('Không thể gửi phản hồi. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  }, [id, note, images, uploadImages, fetchEvidences]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getSenderRoleStyle = useCallback((role: 'CUSTOMER' | 'SELLER' | 'ADMIN') => {
    switch (role) {
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800';
      case 'SELLER':
        return 'bg-orange-100 text-orange-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchReport();
      fetchEvidences();
    }
  }, [id, fetchReport, fetchEvidences]);

  return {
    report,
    orderDetails,
    evidences,
    loading,
    orderLoading,
    evidenceLoading,
    note,
    images,
    imageUrls,
    submitting,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,

    setNote,

    handleImageUpload,
    removeImage,
    handleSubmit,
    handlePageChange,
    handlePageSizeChange,

    getStatusColor,
    getSenderRoleStyle,
    formatCreatedDate,
  };
}
