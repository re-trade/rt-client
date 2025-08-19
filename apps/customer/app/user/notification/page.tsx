'use client';

import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { useNotifications } from '@/hooks/use-notifications';
import {
  getNotificationsByType,
  getUnreadCount,
  groupNotificationsByDate,
} from '@/lib/notification-utils';
import { NotificationResponse } from '@/services/notification.api';
import Pagination from '@components/common/Pagination';
import NotificationEmpty from '@components/notification/NotificationEmpty';
import NotificationFilter from '@components/notification/NotificationFilter';
import NotificationItem from '@components/notification/NotificationItem';
import NotificationSkeleton from '@components/notification/NotificationSkeleton';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, LogIn, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function NotificationPage() {
  const router = useRouter();
  const { auth: isAuthenticated } = useAuth();

  const hookResult = useNotifications(0, 10, { type: 'ALL' });
  const {
    notifications = [],
    loading = false,
    error = null,
    pagination = { page: 0, size: 10, total: 0, totalPages: 0 },
    filters = { type: 'ALL', read: undefined },
    setPage,
    setFilters,
    markAsRead: markAsReadLocal,
    markAsUnread: markAsUnreadLocal,
    markAllAsRead: markAllAsReadLocal,
    refresh,
  } = hookResult || {};

  // Get real-time notifications from context
  const notificationContext = useNotification();
  const {
    notifications: realtimeNotifications = [],
    markAsRead: markAsReadContext,
    markAllAsRead: markAllAsReadContext,
  } = notificationContext || {};

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Merge real-time notifications with paginated notifications
  const allNotifications = useMemo(() => {
    try {
      // Ensure arrays exist
      const realtimeArray = Array.isArray(realtimeNotifications) ? realtimeNotifications : [];
      const notificationsArray = Array.isArray(notifications) ? notifications : [];

      // Combine and deduplicate notifications
      const combined = [...realtimeArray, ...notificationsArray];
      const uniqueNotifications = combined.filter(
        (notification, index, self) =>
          notification &&
          notification.id &&
          index === self.findIndex((n) => n && n.id === notification.id),
      );

      console.log('All notifications merged:', {
        realtime: realtimeArray.length,
        api: notificationsArray.length,
        combined: combined.length,
        unique: uniqueNotifications.length,
      });

      return uniqueNotifications;
    } catch (error) {
      console.error('Error merging notifications:', error);
      return [];
    }
  }, [realtimeNotifications, notifications]);

  // Calculate notification counts for filters using all notifications
  const notificationCounts = useMemo(() => {
    try {
      // Use all notifications for accurate counts
      const baseNotifications = allNotifications || [];
      const total = baseNotifications.length;
      const unread = getUnreadCount(baseNotifications) || 0;

      const byType = {
        ORDER: getNotificationsByType(baseNotifications, 'ORDER')?.length || 0,
        ALERT: getNotificationsByType(baseNotifications, 'ALERT')?.length || 0,
        SYSTEM: getNotificationsByType(baseNotifications, 'SYSTEM')?.length || 0,
      };

      console.log('Notification counts:', {
        total,
        unread,
        byType,
        baseNotifications: baseNotifications.length,
      });
      return { total, unread, byType };
    } catch (error) {
      console.error('Error calculating notification counts:', error);
      return { total: 0, unread: 0, byType: { ORDER: 0, ALERT: 0, SYSTEM: 0 } };
    }
  }, [allNotifications]);

  // Group notifications by date for better organization
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(allNotifications);
  }, [allNotifications]);

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.read) {
      // Mark as read in both local state and context
      markAsReadLocal(notification.id);
      markAsReadContext(notification.id);
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsReadLocal(id);
    markAsReadContext(id);
  };

  const handleMarkAsUnread = (id: string) => {
    markAsUnreadLocal(id);
    // Note: Context doesn't have markAsUnread, so we only update local state
  };

  const handleMarkAllAsRead = () => {
    // Mark all as read in both local state and context
    markAllAsReadLocal();
    markAllAsReadContext();
  };

  // Sync real-time notifications with local state when new ones arrive
  useEffect(() => {
    if (realtimeNotifications.length > 0) {
      refresh();
    }
  }, [realtimeNotifications.length, refresh]);

  const hasFilters = filters.type !== 'ALL' || filters.read !== undefined;
  const hasNotifications = allNotifications.length > 0;

  // Show loading while authentication is being determined
  if (isAuthenticated === undefined || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-orange-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-md border border-orange-200 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
                  <p className="text-gray-600 mt-1">
                    Thông báo từ hệ thống và các cập nhật mới nhất
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {notificationCounts.unread > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Đánh dấu tất cả đã đọc</span>
                    <span className="sm:hidden">Đánh dấu đã đọc</span>
                  </button>
                )}
                <button
                  onClick={refresh}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Làm mới</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 xl:col-span-3 order-2 lg:order-1"
          >
            <NotificationFilter
              filters={filters}
              onFiltersChange={setFilters}
              notificationCounts={
                notificationCounts || {
                  total: 0,
                  unread: 0,
                  byType: { ORDER: 0, ALERT: 0, SYSTEM: 0 },
                }
              }
            />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-9 xl:col-span-9 space-y-6 order-1 lg:order-2"
          >
            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <LogIn className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={refresh}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Thử lại
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && <NotificationSkeleton count={5} />}

            {/* Empty State */}
            {!loading &&
              (!allNotifications || allNotifications.length === 0 || !hasNotifications) && (
                <NotificationEmpty
                  hasFilters={hasFilters}
                  onRefresh={refresh}
                  isRefreshing={loading}
                />
              )}

            {/* Notifications List */}
            {!loading && hasNotifications && (
              <div className="space-y-6">
                {Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
                  <div key={dateGroup} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-orange-100 pb-2">
                      {dateGroup}
                    </h2>
                    <div className="space-y-3">
                      {groupNotifications.map((notification, index) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                          onMarkAsUnread={handleMarkAsUnread}
                          onClick={handleNotificationClick}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && hasNotifications && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page + 1}
                totalPages={pagination.totalPages}
                totalElements={pagination.total}
                onPageChange={(page) => setPage(page - 1)}
                loading={loading}
                theme="default"
                showInfo={true}
                showQuickJump={true}
                size="md"
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
