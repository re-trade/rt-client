'use client';

import Pagination from '@/components/common/Pagination';
import ReportCard from '@/components/report/ReportCard';
import ReportErrorBoundary from '@/components/report/ReportErrorBoundary';
import { ReportListSkeleton } from '@components/report/ReportSkeleton';
import {
  customerReportApi,
  type CustomerReportResponse,
  type ReportListFilters,
  type ReportStatus,
  type ReportType,
} from '@services/report.api';
import { IconChevronDown, IconFilter, IconPlus, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ReportsPageContent() {
  const router = useRouter();
  const [reports, setReports] = useState<CustomerReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<ReportListFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const reportStatuses: ReportStatus[] = [
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'REJECTED',
    'CANCELLED',
  ];
  const reportTypes: ReportType[] = [
    'Sản phẩm không đúng mô tả',
    'Chất lượng sản phẩm kém',
    'Giao hàng chậm',
    'Thái độ phục vụ không tốt',
    'Không giao hàng',
    'Sản phẩm giả/nhái',
    'Khác',
  ];

  const fetchReports = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerReportApi.getMyReports(page, 10, filters);
      setReports(response.content);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError('Không thể tải danh sách báo cáo. Vui lòng thử lại.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(0);
  }, [filters]);

  const handleFilterChange = (key: keyof ReportListFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(0);
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200';
      case 'PROCESSING':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200';
      case 'COMPLETED':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
      case 'REJECTED':
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent">
                Quản lý báo cáo
              </h1>
              <p className="text-gray-600 text-lg">
                Theo dõi và quản lý các báo cáo của bạn một cách hiệu quả
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Cập nhật thời gian thực</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-all duration-300 text-gray-700 font-medium group"
              >
                <IconFilter
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                Bộ lọc
                <IconChevronDown
                  size={18}
                  className={`transition-all duration-300 group-hover:scale-110 ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              <button
                onClick={() => router.push('/user/reports/search')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <IconPlus size={20} />
                Tạo báo cáo mới
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bộ lọc tìm kiếm</h3>
              <p className="text-sm text-gray-600">
                Tùy chỉnh kết quả tìm kiếm theo nhu cầu của bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Tìm kiếm</label>
                <div className="relative group">
                  <IconSearch
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Tìm theo nội dung báo cáo..."
                    value={filters.query || ''}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Trạng thái</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                >
                  <option value="">Tất cả trạng thái</option>
                  {reportStatuses.map((status) => (
                    <option key={status} value={status} className="bg-white text-gray-900">
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Loại báo cáo</label>
                <select
                  value={filters.typeReport || ''}
                  onChange={(e) => handleFilterChange('typeReport', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
                >
                  <option value="">Tất cả loại báo cáo</option>
                  {reportTypes.map((type) => (
                    <option key={type} value={type} className="bg-white text-gray-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-6 py-3 text-orange-600 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition-all duration-300 font-medium transform hover:scale-105"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            <ReportListSkeleton count={6} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto text-center shadow-lg">
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
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => fetchReports(currentPage)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 max-w-lg mx-auto text-center shadow-lg border border-gray-200">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Chưa có báo cáo nào</h3>
              <p className="text-gray-600 mb-8">
                Bạn chưa tạo báo cáo nào. Hãy tạo báo cáo đầu tiên để bắt đầu theo dõi.
              </p>
              <button
                onClick={() => router.push('/user/reports/search')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-xl hover:from-orange-600 hover:via-orange-700 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                Tạo báo cáo đầu tiên
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-700 font-medium">
                    Hiển thị <span className="font-bold text-orange-600">{reports.length}</span>{' '}
                    trong tổng số <span className="font-bold text-orange-600">{totalElements}</span>{' '}
                    báo cáo
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
                </div>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {reports.map((report, index) => (
                <div
                  key={report.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ReportCard
                    report={report}
                    onViewDetail={() => router.push(`/user/reports/${report.id}`)}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchReports(page);
                  }}
                  theme="default"
                  size="md"
                  showInfo={true}
                  animated={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ReportErrorBoundary>
      <ReportsPageContent />
    </ReportErrorBoundary>
  );
}
