'use client';

import LoadingSpinner from '@/components/common/Loading';
import Pagination from '@/components/common/Pagination';
import {
  customerReportApi,
  type CustomerReportEvidenceResponse,
  type CustomerReportResponse,
  type ReportStatus,
} from '@services/report.api';
import { getSellerProfile, TSellerProfile } from '@services/seller.api';
import {
  IconArrowLeft,
  IconCalendar,
  IconFileText,
  IconMessageCircle,
  IconPhoto,
  IconUser,
} from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const [report, setReport] = useState<CustomerReportResponse | null>(null);
  const [evidences, setEvidences] = useState<CustomerReportEvidenceResponse[]>([]);
  const [seller, setSeller] = useState<TSellerProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const reportData = await customerReportApi.getReportById(reportId);
      setReport(reportData);
    } catch (err) {
      setError('Không thể tải thông tin báo cáo. Vui lòng thử lại.');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvidences = async (page: number = 0) => {
    try {
      setEvidenceLoading(true);
      const evidenceData = await customerReportApi.getReportEvidences(reportId, page, 10);
      setEvidences(evidenceData.content);
      setCurrentPage(evidenceData.page);
      setTotalPages(evidenceData.totalPages);
    } catch (err) {
      console.error('Error fetching evidences:', err);
    } finally {
      setEvidenceLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      fetchReport();
      fetchEvidences();
    }
  }, [reportId]);
  useEffect(() => {
    if (report?.sellerId) {
      const fetchSellerProfile = async () => {
        try {
          const sellerData = await getSellerProfile(report.sellerId);
          setSeller(sellerData);
        } catch (err) {
          console.error('Error fetching seller profile:', err);
        }
      };

      fetchSellerProfile();
    }
  }, [report]);

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'REJECTED':
        return 'Từ chối';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800';
      case 'SELLER':
        return 'bg-orange-100 text-orange-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'CUSTOMER':
        return 'Khách hàng';
      case 'SELLER':
        return 'Người bán';
      case 'ADMIN':
        return 'Quản trị viên';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error || 'Không tìm thấy báo cáo'}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Quay lại
              </button>
              <button
                onClick={fetchReport}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <IconArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Chi tiết báo cáo
          </h1>
          <p className="text-gray-600 mt-1">Mã báo cáo: {report.id}</p>
        </div>
      </div>

      {/* Report Info */}
      <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            {seller ? (
              <>
                <img
                  src={seller.avatarUrl || ''}
                  alt={seller.shopName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{seller.shopName}</h2>
                  <p className="text-gray-600">Người bán</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </>
            )}
          </div>

          <div className={`px-4 py-2 rounded-lg border ${getStatusColor(report.resolutionStatus)}`}>
            {getStatusText(report.resolutionStatus)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <IconFileText size={20} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Loại báo cáo</p>
              <p className="font-medium">{report.typeReport}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconCalendar size={20} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Ngày tạo</p>
              <p className="font-medium">{formatDate(report.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconUser size={20} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Mã đơn hàng</p>
              <p className="font-medium">{report.orderId}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Nội dung báo cáo</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 leading-relaxed">{report.content}</p>
          </div>
        </div>

        {report.resolutionDetail && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Kết quả xử lý</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-900 leading-relaxed">{report.resolutionDetail}</p>
              {report.resolutionDate && (
                <p className="text-sm text-blue-600 mt-2">
                  Ngày xử lý: {formatDate(report.resolutionDate)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Section */}
      <div className="bg-white rounded-lg border border-orange-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <IconMessageCircle size={20} className="text-orange-500" />
          <h3 className="text-xl font-semibold text-gray-900">Trao đổi & Bằng chứng</h3>
        </div>

        {evidenceLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : evidences.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Chưa có trao đổi nào</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {evidences.map((evidence) => (
                <div key={evidence.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {evidence.senderAvatarUrl && (
                      <img
                        src={evidence.senderAvatarUrl}
                        alt={evidence.senderName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{evidence.senderName}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getRoleColor(evidence.senderRole)}`}
                        >
                          {getRoleText(evidence.senderRole)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(evidence.createdAt)}</p>
                    </div>
                  </div>

                  {evidence.notes && (
                    <div className="mb-3">
                      <p className="text-gray-700 leading-relaxed">{evidence.notes}</p>
                    </div>
                  )}

                  {evidence.evidenceUrls.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <IconPhoto size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Bằng chứng đính kèm</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {evidence.evidenceUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(url, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchEvidences(page);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
