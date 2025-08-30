import { authApi } from '@retrade/util';

export type NotificationResponse = {
  id: string;
  type: 'ORDER' | 'ALERT' | 'SYSTEM';
  title: string;
  content: string;
  read: boolean;
  createdDate: string;
};

export interface GetNotificationsParams {
  page?: number;
  size?: number;
  type?: 'ORDER' | 'ALERT' | 'SYSTEM';
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
        const result = {
          content: response.data.content || [],
          page: response.data.pagination?.page || page,
          size: response.data.pagination?.size || size,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        };
        return result;
      }

      throw new Error(
        `API response indicates failure: ${response.data.message || 'Unknown error'}`,
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Please login again');
      } else if (error.response?.status === 404) {
        throw new Error('Notification service not found');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error - Please try again later');
      }

      throw error;
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await authApi.notification.patch(`/notifications/${notificationId}/read`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  },

  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await authApi.notification.put('/notifications/mark-all-read');
      return response.data.success;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  },

  async markAsUnread(notificationId: string): Promise<boolean> {
    try {
      const response = await authApi.notification.put(`/notifications/${notificationId}/unread`);
      return response.data.success;
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
      return false;
    }
  },
};

export default notificationApi;
