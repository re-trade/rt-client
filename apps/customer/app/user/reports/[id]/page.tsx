'use client';

import LoadingSpinner from '@/components/common/Loading';
import Pagination from '@/components/common/Pagination';
import { useToast } from '@/context/ToastContext';
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
  const toast = useToast();

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const reportData = await customerReportApi.getReportById(reportId);
      setReport(reportData);
    } catch (err) {
      setError('Không thể tải thông tin báo cáo. Vui lòng thử lại.');
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
        } catch (err) {}
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-gray-600">Đang tải chi tiết báo cáo...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
          <p className="text-red-600 mb-6">{error || 'Không tìm thấy báo cáo'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium"
            >
              Quay lại
            </button>
            <button
              onClick={fetchReport}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
          >
            <IconArrowLeft size={22} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Chi tiết báo cáo</h1>
            <p className="text-gray-500 mt-1 font-mono text-sm">ID: {report.id}</p>
          </div>
        </div>

        {/* Report Info */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              {seller ? (
                <>
                  <img
                    src={seller.avatarUrl || '/default-avatar.png'}
                    alt={seller.shopName}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-orange-100"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{seller.shopName}</h2>
                    <p className="text-gray-500">Người bán</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </>
              )}
            </div>

            <div
              className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm ${getStatusColor(report.resolutionStatus)}`}
            >
              {getStatusText(report.resolutionStatus)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <IconFileText size={24} className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Loại báo cáo</p>
                <p className="font-semibold text-gray-900">{report.typeReport}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <IconCalendar size={24} className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Ngày tạo</p>
                <p className="font-semibold text-gray-900">{formatDate(report.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <IconUser size={24} className="text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Mã đơn hàng</p>
                <p className="font-semibold text-gray-900 font-mono">{report.orderId}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Nội dung báo cáo</h3>
              <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-orange-400">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {report.content}
                </p>
              </div>
            </div>

            {report.resolutionDetail && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Kết quả xử lý</h3>
                <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-400">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {report.resolutionDetail}
                  </p>
                  {report.resolutionDate && (
                    <p className="text-sm text-green-600 mt-4 text-right">
                      Ngày xử lý: {formatDate(report.resolutionDate)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Evidence Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-100 rounded-xl">
              <IconMessageCircle size={24} className="text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Trao đổi & Bằng chứng</h3>
          </div>

          {evidenceLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center space-y-4">
                <LoadingSpinner />
                <p className="text-gray-600">Đang tải bằng chứng...</p>
              </div>
            </div>
          ) : evidences.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconMessageCircle size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-600">Chưa có trao đổi hoặc bằng chứng nào được cung cấp.</p>
            </div>
          ) : (
            <div>
              <div className="space-y-8">
                {evidences.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="border-t border-gray-200 pt-8 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={evidence.senderAvatarUrl || '/default-avatar.png'}
                        alt={evidence.senderName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">
                              {evidence.senderName}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(evidence.senderRole)}`}
                            >
                              {getRoleText(evidence.senderRole)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 sm:mt-0">
                            {formatDate(evidence.createdAt)}
                          </p>
                        </div>

                        {evidence.notes && (
                          <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {evidence.notes}
                            </p>
                          </div>
                        )}

                        {evidence.evidenceUrls.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <IconPhoto size={18} className="text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">
                                Bằng chứng đính kèm ({evidence.evidenceUrls.length})
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {evidence.evidenceUrls.map((url, index) => (
                                <a
                                  key={index}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block relative group"
                                >
                                  <img
                                    src={url}
                                    alt={`Evidence ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <IconPhoto size={24} className="text-white" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      fetchEvidences(page);
                    }}
                    theme="purchase"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
