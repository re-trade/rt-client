'use client';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import notificationApi, {
  GetNotificationsParams,
  NotificationResponse,
} from '@/services/notification.api';
import { useCallback, useEffect, useState } from 'react';

export interface NotificationFilters {
  type?: 'ORDER' | 'ALERT' | 'SYSTEM' | 'ALL';
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

  fetchNotifications: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
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
  const toast = useToast();
  const [filters, setFiltersState] = useState<NotificationFilters>(initialFilters);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiParams: GetNotificationsParams = {
        page: pagination.page,
        size: pagination.size,
      };

      if (filters.type && filters.type !== 'ALL') {
        apiParams.type = filters.type as 'ORDER' | 'ALERT' | 'SYSTEM';
      }

      if (filters.read !== undefined) {
        apiParams.read = filters.read;
      }

      const response = await notificationApi.getNotifications(apiParams);

      let notifications = response.content;
      if (filters.type && filters.type !== 'ALL') {
        notifications = notifications.filter((notification) => notification.type === filters.type);
      }

      if (filters.read !== undefined) {
        notifications = notifications.filter((notification) => notification.read === filters.read);
      }

      setNotifications(notifications);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }));
    } catch (err) {
      console.error('Error fetching notifications:', err);
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

  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({ ...prev, size, page: 0 }));
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
        toast.showToast('Lỗi khi cập nhập đã đọc thông báo', 'error');
      }
    },
    [isAuthenticated],
  );

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    const previousNotifications = notifications;
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
    try {
      await notificationApi.markAllAsRead();
    } catch (error) {
      setNotifications(previousNotifications);
      toast.showToast('Lỗi khi cập nhập đã đọc thông báo', 'error');
    }
  }, [notifications, isAuthenticated]);

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
        toast.showToast('Lỗi khi cập nhập chưa đọc thông báo', 'error');
      }
    },
    [isAuthenticated],
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
    fetchNotifications,
    setPage,
    setPageSize,
    setFilters,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    refresh,
  };
};
