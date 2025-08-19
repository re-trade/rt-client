'use client';

import { motion } from 'framer-motion';
import { Bell, RefreshCw } from 'lucide-react';

interface NotificationEmptyProps {
  title?: string;
  description?: string;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  hasFilters?: boolean;
}

export default function NotificationEmpty({
  title,
  description,
  showRefreshButton = true,
  onRefresh,
  isRefreshing = false,
  hasFilters = false,
}: NotificationEmptyProps) {
  const defaultTitle = hasFilters ? 'Không có thông báo phù hợp' : 'Chưa có thông báo nào';
  const defaultDescription = hasFilters
    ? 'Không tìm thấy thông báo nào phù hợp với bộ lọc hiện tại. Hãy thử thay đổi bộ lọc hoặc xóa bộ lọc để xem tất cả thông báo.'
    : 'Bạn chưa có thông báo nào. Các thông báo về đơn hàng, khuyến mãi và cập nhật hệ thống sẽ xuất hiện ở đây.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-12 border border-orange-200 text-center"
    >
      <div className="mx-auto w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
        <Bell className="w-12 h-12 text-orange-600" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{title || defaultTitle}</h3>

      <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
        {description || defaultDescription}
      </p>

      {showRefreshButton && onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Đang tải...' : 'Làm mới'}</span>
        </button>
      )}
    </motion.div>
  );
}
