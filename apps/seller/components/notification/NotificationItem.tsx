'use client';

import {
  formatNotificationDate,
  getNotificationIcon,
  getNotificationTypeColor,
  getNotificationTypeLabel,
} from '@/lib/notification-utils';
import { cn } from '@/lib/utils';
import { NotificationResponse } from '@/service/notification.api';
import { Check, MoreHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface NotificationItemProps {
  notification: NotificationResponse;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
}: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false);
  const Icon = getNotificationIcon(notification.type);

  const handleMarkAsRead = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    setShowActions(false);
  };

  const handleMarkAsUnread = () => {
    if (notification.read && onMarkAsUnread) {
      onMarkAsUnread(notification.id);
    }
    setShowActions(false);
  };

  return (
    <div
      className={cn(
        'relative flex items-start space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors',
        !notification.read && 'bg-orange-50 border-orange-100',
      )}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-6 w-2 h-2 bg-orange-500 rounded-full" />
      )}

      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          getNotificationTypeColor(notification.type),
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn('text-sm font-medium', !notification.read && 'text-gray-900')}>
            {notification.title}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {formatNotificationDate(notification.createdDate)}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>

              {/* Actions dropdown */}
              {showActions && (
                <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {!notification.read ? (
                    <button
                      onClick={handleMarkAsRead}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Đánh dấu đã đọc</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleMarkAsUnread}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Đánh dấu chưa đọc</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className={cn('text-sm text-gray-600 mb-2', !notification.read && 'text-gray-800')}>
          {notification.content}
        </p>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getNotificationTypeColor(notification.type),
            )}
          >
            {getNotificationTypeLabel(notification.type)}
          </span>
        </div>
      </div>

      {/* Click overlay to close actions */}
      {showActions && <div className="fixed inset-0 z-5" onClick={() => setShowActions(false)} />}
    </div>
  );
}
