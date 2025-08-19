'use client';

import {
  formatNotificationDate,
  getNotificationIcon,
  getNotificationTypeColor,
} from '@/lib/notification-utils';
import { cn } from '@/lib/utils';
import { NotificationResponse } from '@/service/notification.api';
import { ExternalLink } from 'lucide-react';
import NotificationEmpty from './NotificationEmpty';

interface NotificationDropdownProps {
  notifications: NotificationResponse[];
  onClose: () => void;
  onViewAll: () => void;
}

export default function NotificationDropdown({
  notifications,
  onClose,
  onViewAll,
}: NotificationDropdownProps) {
  return (
    <div className="w-96 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
          <button
            onClick={onViewAll}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center"
          >
            Xem tất cả
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4">
            <NotificationEmpty message="Bạn chưa có thông báo mới nào" />
          </div>
        ) : (
          <div>
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start space-x-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer',
                    !notification.read && 'bg-orange-50 border-orange-100',
                  )}
                  onClick={onClose}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-2 top-6 w-2 h-2 bg-orange-500 rounded-full" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                      getNotificationTypeColor(notification.type),
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={cn(
                          'text-sm font-medium truncate',
                          !notification.read && 'text-gray-900',
                        )}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatNotificationDate(notification.createdDate)}
                      </span>
                    </div>

                    <p
                      className={cn(
                        'text-sm text-gray-600 line-clamp-2',
                        !notification.read && 'text-gray-800',
                      )}
                    >
                      {notification.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onViewAll}
            className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Xem tất cả thông báo
          </button>
        </div>
      )}
    </div>
  );
}
