'use client';

import {
  formatNotificationDate,
  getNotificationIcon,
  getNotificationTypeColor,
  getNotificationTypeLabel,
} from '@/lib/notification-utils';
import { NotificationResponse } from '@/services/notification.api';
import { motion } from 'framer-motion';
import { Check, Dot } from 'lucide-react';
import { useState } from 'react';

interface NotificationItemProps {
  notification: NotificationResponse;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onClick?: (notification: NotificationResponse) => void;
  showActions?: boolean;
  index?: number;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onClick,
  showActions = true,
  index = 0,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleMarkAsUnread = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsUnread) {
      onMarkAsUnread(notification.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`relative p-4 border rounded-xl transition-all duration-200 cursor-pointer group ${
        notification.read
          ? 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
          : 'bg-orange-50 border-orange-200 hover:border-orange-400 hover:shadow-md'
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 left-2 w-2 h-2 bg-orange-500 rounded-full"></div>
      )}

      <div className="flex items-start space-x-3 ml-2">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {(() => {
            const IconComponent = getNotificationIcon(notification.type);
            const iconColor =
              notification.type === 'ORDER'
                ? 'text-blue-600'
                : notification.type === 'ALERT'
                  ? 'text-red-600'
                  : 'text-gray-600';
            return <IconComponent className={`w-5 h-5 ${iconColor}`} />;
          })()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Type badge */}
              <div className="flex items-center space-x-2 mb-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getNotificationTypeColor(notification.type)}`}
                >
                  {getNotificationTypeLabel(notification.type)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatNotificationDate(notification.createdDate)}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-sm font-semibold mb-1 ${
                  notification.read ? 'text-gray-800' : 'text-gray-900'
                }`}
              >
                {notification.title}
              </h3>

              {/* Content */}
              <p
                className={`text-sm leading-relaxed ${
                  notification.read ? 'text-gray-600' : 'text-gray-700'
                }`}
              >
                {notification.content}
              </p>
            </div>

            {/* Actions */}
            {showActions && (isHovered || !notification.read) && (
              <div className="flex items-center space-x-1 ml-2">
                {!notification.read ? (
                  <button
                    onClick={handleMarkAsRead}
                    className="p-1 rounded-full hover:bg-orange-100 transition-colors"
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="w-4 h-4 text-orange-600" />
                  </button>
                ) : (
                  <button
                    onClick={handleMarkAsUnread}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title="Đánh dấu chưa đọc"
                  >
                    <Dot className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-200 pointer-events-none ${
          isHovered ? 'bg-gradient-to-r from-orange-500/5 to-transparent opacity-100' : 'opacity-0'
        }`}
      />
    </motion.div>
  );
}
