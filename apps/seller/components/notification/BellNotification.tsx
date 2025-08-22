'use client';

import { useNotification } from '@/context/NotificationContext';
import { useNotifications } from '@/hooks/use-notifications';
import { getUnreadCount } from '@/lib/notification-utils';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NotificationDropdown from './NotificationDropdown';

export default function BellNotification() {
  const router = useRouter();
  const { notifications: socketNotifications } = useNotification();
  const { notifications: apiNotifications, refresh } = useNotifications(0, 20);
  const [isOpen, setIsOpen] = useState(false);
  const [allNotifications, setAllNotifications] = useState(apiNotifications);

  useEffect(() => {
    const mergedNotifications = [...socketNotifications, ...apiNotifications];
    const uniqueNotifications = mergedNotifications.filter(
      (notification, index, self) => index === self.findIndex((n) => n.id === notification.id),
    );
    setAllNotifications(uniqueNotifications);
  }, [socketNotifications, apiNotifications]);

  const unreadCount = getUnreadCount(allNotifications);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      refresh();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={cn(
          'relative p-2 rounded-lg transition-colors',
          'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
          isOpen && 'bg-gray-100',
        )}
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} />

          <div className="absolute right-0 top-full mt-2 z-50">
            <NotificationDropdown
              notifications={allNotifications.slice(0, 10)} // Show only recent 10
              onClose={handleClose}
              onViewAll={() => {
                setIsOpen(false);
                router.push('/dashboard/notifications');
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
