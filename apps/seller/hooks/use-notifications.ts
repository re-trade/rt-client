'use client';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import notificationApi, {
  GetNotificationsParams,
  NotificationResponse,
} from '@/service/notification.api';
import { useCallback, useEffect, useState } from 'react';

export interface NotificationFilters {
  type?: 'ORDER' | 'ALERT' | 'SYSTEM' | 'REVIEW' | 'ACCOUNT' | 'ALL';
  read?: boolean;
}

export interface NotificationPagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface UseNotificationsReturn {
  notifications: NotificationResponse[];
  loading: boolean;
  error: string | null;
  pagination: NotificationPagination;
  filters: NotificationFilters;
  setPage: (page: number) => void;
  setFilters: (filters: NotificationFilters) => void;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useNotifications = (
  initialPage: number = 0,
  initialSize: number = 10,
  initialFilters: NotificationFilters = { type: 'ALL' },
): UseNotificationsReturn => {
  const { auth: isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<NotificationPagination>({
    page: initialPage,
    size: initialSize,
    total: 0,
    totalPages: 0,
  });
  const { showToast } = useToast();
  const [filters, setFiltersState] = useState<NotificationFilters>(initialFilters);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params: GetNotificationsParams = {
        page: pagination.page,
        size: pagination.size,
        type: filters.type !== 'ALL' ? filters.type : undefined,
        read: filters.read,
      };

      const response = await notificationApi.getNotifications(params);

      const notifications = response.content.map((notification) => ({
        ...notification,
        createdDate: notification.createdDate,
      }));

      setNotifications(notifications);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }));
    } catch (err) {
      console.error('Error fetching seller notifications:', err);
      if (err instanceof Error && err.message.includes('401')) {
        setError('Bạn cần đăng nhập để xem thông báo');
      } else if (err instanceof Error && err.message.includes('404')) {
        setError('Không tìm thấy dịch vụ thông báo');
      } else {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông báo');
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, filters, isAuthenticated]);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setFilters = useCallback((newFilters: NotificationFilters) => {
    setFiltersState(newFilters);
    setPagination((prev) => ({ ...prev, page: 0 })); // Reset to first page when filters change
  }, []);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification,
        ),
      );
      try {
        await notificationApi.markAsRead(id);
      } catch (error) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, read: false } : notification,
          ),
        );
        showToast('Lỗi khi đánh dấu đã đọc thông báo', 'error');
      }
    },
    [isAuthenticated, showToast],
  );

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;
    const originalNotifications = [...notifications];
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    try {
      await notificationApi.markAllAsRead();
    } catch (error) {
      setNotifications(originalNotifications);
      showToast('Lỗi khi đánh dấu đã đọc tất cả thông báo', 'error');
    }
  }, [notifications, isAuthenticated, showToast]);

  const markAsUnread = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: false } : notification,
        ),
      );
      try {
        await notificationApi.markAsUnread(id);
      } catch (error) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        );
        showToast('Lỗi khi cập nhập chưa đọc thông báo', 'error');
      }
    },
    [isAuthenticated, showToast],
  );

  const refresh = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
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
  };
};
