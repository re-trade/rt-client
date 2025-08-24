'use client';

import Pagination from '@/components/common/Pagination';
import ReportErrorBoundary from '@/components/report/ReportErrorBoundary';
import { ComboSearchSkeleton } from '@components/report/ReportSkeleton';
import { orderApi, type OrderCombo } from '@services/order.api';
import { IconArrowRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ReportSearchPageContent() {
  const router = useRouter();
  const [combos, setCombos] = useState<OrderCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchReportableCombos = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderApi.getCustomerOrderComboCanReport(page);
      setCombos(response.content);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportableCombos(0);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Tìm kiếm đơn hàng để báo cáo
          </h1>
          <p className="text-gray-600 mt-2">Chọn đơn hàng bạn muốn tạo báo cáo</p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <ComboSearchSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchReportableCombos(currentPage)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : combos.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">Không tìm thấy đơn hàng nào có thể báo cáo</p>
            <button
              onClick={() => router.push('/user/purchase')}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              Xem đơn hàng của tôi
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">Tìm thấy {totalElements} đơn hàng có thể báo cáo</p>
          </div>

          {/* Combos Grid */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {combos.map((combo) => (
              <div
                key={combo.comboId}
                className="bg-white rounded-lg border border-orange-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {combo.sellerAvatarUrl && (
                        <img
                          src={combo.sellerAvatarUrl}
                          alt={combo.sellerName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{combo.sellerName}</h3>
                        <p className="text-sm text-gray-600">Mã đơn: {combo.comboId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Trạng thái:</span>
                        <p className="font-medium text-gray-900">{combo.orderStatus}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tổng tiền:</span>
                        <p className="font-medium text-gray-900">{formatPrice(combo.grandPrice)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Ngày tạo:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(combo.createDate || '')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Cập nhật:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(combo.updateDate || '')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/user/reports/create?comboId=${combo.comboId}&sellerId=${combo.sellerId}`,
                      )
                    }
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    Tạo báo cáo
                    <IconArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchReportableCombos(page);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function ReportSearchPage() {
  return (
    <ReportErrorBoundary>
      <ReportSearchPageContent />
    </ReportErrorBoundary>
  );
}
