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
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tìm kiếm đơn hàng để báo cáo</h1>
          <p className="text-gray-500 mt-2">
            Chỉ các đơn hàng đã hoàn thành mới có thể được báo cáo. Chọn một đơn hàng để bắt đầu.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
          {/* Content */}
          {loading ? (
            <ComboSearchSkeleton count={4} />
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-8 max-w-md mx-auto text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <button
                  onClick={() => fetchReportableCombos(currentPage)}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : combos.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="bg-gray-50 rounded-2xl p-12 max-w-lg mx-auto text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Không có đơn hàng nào</h3>
                <p className="text-gray-600 mb-8">Hiện tại không có đơn hàng nào có thể báo cáo.</p>
                <button
                  onClick={() => router.push('/user/purchase')}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  Xem lịch sử mua hàng
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-gray-600 font-medium">
                  Tìm thấy <span className="font-bold text-orange-600">{totalElements}</span> đơn
                  hàng có thể báo cáo
                </p>
              </div>

              {/* Combos Grid */}
              <div className="space-y-6">
                {combos.map((combo) => (
                  <div
                    key={combo.comboId}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-orange-300 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={combo.sellerAvatarUrl || '/default-avatar.png'}
                            alt={combo.sellerName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {combo.sellerName}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono">
                              Mã đơn: {combo.comboId}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Trạng thái:</span>
                            <p className="font-semibold text-gray-900">{combo.orderStatus}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Tổng tiền:</span>
                            <p className="font-semibold text-gray-900">
                              {formatPrice(combo.grandPrice)}
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Ngày tạo:</span>
                            <p className="font-semibold text-gray-900">
                              {formatDate(combo.createDate || '')}
                            </p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Cập nhật:</span>
                            <p className="font-semibold text-gray-900">
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
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap font-semibold"
                      >
                        Tạo báo cáo
                        <IconArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      fetchReportableCombos(page);
                    }}
                    theme="purchase"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
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
