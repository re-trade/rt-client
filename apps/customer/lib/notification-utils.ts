import { NotificationResponse } from '@/services/notification.api';
import { AlertCircle, Bell, LucideIcon, Package } from 'lucide-react';

export const getNotificationIcon = (type: NotificationResponse['type']): LucideIcon => {
  switch (type) {
    case 'ORDER':
      return Package;
    case 'ALERT':
      return AlertCircle;
    case 'SYSTEM':
      return Bell;
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
    default:
      return 'Khác';
  }
};

export const getNotificationTypeColor = (type: NotificationResponse['type']) => {
  switch (type) {
    case 'ORDER':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'ALERT':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'SYSTEM':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
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

export const getNotificationPriority = (
  notification: NotificationResponse,
): 'high' | 'medium' | 'low' => {
  if (notification.type === 'ALERT') return 'high';
  if (notification.type === 'ORDER') return 'medium';
  return 'low';
};

export const sortNotificationsByPriority = (
  notifications: NotificationResponse[],
): NotificationResponse[] => {
  return [...notifications].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = getNotificationPriority(a);
    const bPriority = getNotificationPriority(b);

    if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
      return priorityOrder[bPriority] - priorityOrder[aPriority];
    }

    // If same priority, sort by date (newest first)
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
  });
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

export const getUnreadCount = (notifications: NotificationResponse[]): number => {
  return notifications.filter((notification) => !notification.read).length;
};

export const getNotificationsByType = (
  notifications: NotificationResponse[],
  type: NotificationResponse['type'],
): NotificationResponse[] => {
  return notifications.filter((notification) => notification.type === type);
};
