import { authApi } from '@retrade/util';

export type NotificationResponse = {
  id: string;
  type: 'ORDER' | 'ALERT' | 'SYSTEM' | 'REVIEW' | 'ACCOUNT';
  title: string;
  content: string;
  read: boolean;
  createdDate: string;
};

export interface GetNotificationsParams {
  page?: number;
  size?: number;
  type?: 'ORDER' | 'ALERT' | 'SYSTEM' | 'REVIEW' | 'ACCOUNT';
  read?: boolean;
}

const notificationApi = {
  async getNotifications(params: GetNotificationsParams = {}): Promise<{
    content: NotificationResponse[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
  }> {
    const { page = 0, size = 10, type, read } = params;

    const urlQuery = new URLSearchParams();
    urlQuery.set('page', page.toString());
    urlQuery.set('size', size.toString());

    if (type && type !== 'ALL') {
      urlQuery.set('type', type);
    }

    if (read !== undefined) {
      urlQuery.set('read', read.toString());
    }

    try {
      const response = await authApi.notification.get(`/notifications/me?${urlQuery.toString()}`);

      if (response.data.success) {
        return {
          content: response.data.content || [],
          page: response.data.pagination?.page || page,
          size: response.data.pagination?.size || size,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        };
      }
      return {
        content: [],
        page: 0,
        size: 10,
        total: 0,
        totalPages: 0,
      };
    } catch (error) {
      return {
        content: [],
        page: 0,
        size: 10,
        total: 0,
        totalPages: 0,
      };
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await authApi.notification.put(`/notifications/${notificationId}/read`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to mark seller notification as read:', error);
      return false;
    }
  },

  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await authApi.notification.put('/notifications/mark-all');
      return response.data.success;
    } catch (error) {
      return false;
    }
  },

  async markAsUnread(notificationId: string): Promise<boolean> {
    try {
      const response = await authApi.notification.put(`/notifications/${notificationId}/unread`);
      return response.data.success;
    } catch (error) {
      return false;
    }
  },
};

export default notificationApi;
