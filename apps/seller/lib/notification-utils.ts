import { NotificationResponse } from '@/service/notification.api';
import { AlertCircle, Bell, LucideIcon, Package, Star, User } from 'lucide-react';

export const getNotificationIcon = (type: NotificationResponse['type']): LucideIcon => {
  switch (type) {
    case 'ORDER':
      return Package;
    case 'ALERT':
      return AlertCircle;
    case 'SYSTEM':
      return Bell;
    case 'REVIEW':
      return Star;
    case 'ACCOUNT':
      return User;
    default:
      return Bell;
  }
};

export const getNotificationTypeLabel = (type: NotificationResponse['type']) => {
  switch (type) {
    case 'ORDER':
      return 'Đơn hàng';
    case 'ALERT':
      return 'Cảnh báo';
    case 'SYSTEM':
      return 'Hệ thống';
    case 'REVIEW':
      return 'Đánh giá';
    case 'ACCOUNT':
      return 'Tài khoản';
    default:
      return 'Khác';
  }
};

export const getNotificationTypeColor = (type: NotificationResponse['type']) => {
  switch (type) {
    case 'ORDER':
      return 'bg-blue-100 text-blue-800';
    case 'ALERT':
      return 'bg-red-100 text-red-800';
    case 'SYSTEM':
      return 'bg-gray-100 text-gray-800';
    case 'REVIEW':
      return 'bg-yellow-100 text-yellow-800';
    case 'ACCOUNT':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatNotificationDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
};

export const getNotificationsByType = (
  notifications: NotificationResponse[],
  type: NotificationResponse['type'] | 'ALL',
) => {
  if (type === 'ALL') {
    return notifications;
  }
  return notifications.filter((notification) => notification.type === type);
};

export const getUnreadCount = (notifications: NotificationResponse[]) => {
  return notifications.filter((notification) => !notification.read).length;
};

export const groupNotificationsByDate = (notifications: NotificationResponse[]) => {
  const groups: { [key: string]: NotificationResponse[] } = {};

  notifications.forEach((notification) => {
    const date = new Date(notification.createdDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey: string;

    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Hôm qua';
    } else {
      groupKey = date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
  });

  return groups;
};
