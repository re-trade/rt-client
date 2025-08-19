'use client';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { ChevronLeft, ChevronRight, Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import NotificationEmpty from './NotificationEmpty';
import NotificationItem from './NotificationItem';
import NotificationSkeleton from './NotificationSkeleton';

const NOTIFICATION_TYPES = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'ORDER', label: 'Đơn hàng' },
  { value: 'ALERT', label: 'Cảnh báo' },
  { value: 'SYSTEM', label: 'Hệ thống' },
] as const;

const READ_STATUS_OPTIONS = [
  { value: undefined, label: 'Tất cả' },
  { value: false, label: 'Chưa đọc' },
  { value: true, label: 'Đã đọc' },
] as const;

export default function NotificationList() {
  const {
    notifications,
    loading,
    error,
    pagination,
    filters,
    setPage,
    setFilters,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    refresh,
  } = useNotifications();

  const [showFilters, setShowFilters] = useState(false);

  const handleTypeFilter = (type: (typeof NOTIFICATION_TYPES)[number]['value']) => {
    setFilters({ ...filters, type });
  };

  const handleReadFilter = (read: (typeof READ_STATUS_OPTIONS)[number]['value']) => {
    setFilters({ ...filters, read });
  };

  const handlePrevPage = () => {
    if (pagination.page > 0) {
      setPage(pagination.page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setPage(pagination.page + 1);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
            {notifications.some((n) => !n.read) && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại thông báo</label>
              <div className="flex flex-wrap gap-2">
                {NOTIFICATION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeFilter(type.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.type === type.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <div className="flex flex-wrap gap-2">
                {READ_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleReadFilter(option.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.read === option.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-h-96">
        {loading ? (
          <NotificationSkeleton />
        ) : notifications.length === 0 ? (
          <NotificationEmpty message="Không có thông báo nào phù hợp với bộ lọc" />
        ) : (
          <div>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
              />
            ))}
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Trang {pagination.page + 1} / {pagination.totalPages} ({pagination.total} thông báo)
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handlePrevPage}
                disabled={pagination.page === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={pagination.page >= pagination.totalPages - 1}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
