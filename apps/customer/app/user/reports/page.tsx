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
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Quản lý báo cáo
          </h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý các báo cáo của bạn</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200"
          >
            <IconFilter size={18} />
            Bộ lọc
            <IconChevronDown
              size={16}
              className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>

          <button
            onClick={() => router.push('/user/reports/search')}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <IconPlus size={18} />
            Tạo báo cáo mới
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-orange-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <IconSearch
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tìm theo nội dung..."
                  value={filters.query || ''}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              >
                <option value="">Tất cả trạng thái</option>
                {reportStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại báo cáo</label>
              <select
                value={filters.typeReport || ''}
                onChange={(e) => handleFilterChange('typeReport', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              >
                <option value="">Tất cả loại</option>
                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <ReportListSkeleton count={6} />
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchReports(currentPage)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">Bạn chưa có báo cáo nào</p>
            <button
              onClick={() => router.push('/user/reports/search')}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              Tạo báo cáo đầu tiên
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Hiển thị {reports.length} trong tổng số {totalElements} báo cáo
            </p>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onViewDetail={() => router.push(`/user/reports/${report.id}`)}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchReports(page);
              }}
            />
          )}
        </>
      )}
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
