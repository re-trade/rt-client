'use client';

import { useNotification } from '@/context/NotificationContext';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function BellNotification() {
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationListRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const maxNotifications = 4;

  useEffect(() => {
    const unreadExists = notifications.some((notification) => !notification.read);
    setHasUnread(unreadExists);
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setTimeout(() => {
        if (!notificationListRef.current?.matches(':hover')) {
          setIsOpen(false);
        }
      }, 100);
    }
  }, [isMobile]);

  const toggleNotifications = useCallback(() => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  }, [isMobile, isOpen]);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setHasUnread(false);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    router.push('/user/notification');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'ALERT':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      case 'SYSTEM':
      default:
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
    }
  };

  return (
    <div
      className="relative z-50"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={toggleNotifications}
        className="lg:text-orange-700 lg:hover:text-orange-800 flex items-center gap-2 font-medium transition-colors duration-200 relative p-3 lg:p-0 hover:bg-orange-50 lg:hover:bg-transparent rounded-xl lg:rounded-none"
      >
        <div className="relative">
          <Bell className="w-5 h-5 lg:w-4 lg:h-4 text-gray-600 lg:text-inherit" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
        <span className="hidden lg:inline">Thông báo</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 max-h-[85vh] lg:max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            ref={notificationListRef}
            onMouseEnter={() => !isMobile && setIsOpen(true)}
            onMouseLeave={() => !isMobile && setIsOpen(false)}
          >
            <div className="sticky top-0 bg-white px-4 py-2 border-b border-gray-200 font-medium text-gray-700 flex justify-between items-center">
              <span>Thông báo</span>
              {notifications.length > 0 && (
                <button
                  className="text-xs text-orange-500 hover:text-orange-600"
                  onClick={handleMarkAllAsRead}
                >
                  Đánh dấu đã đọc tất cả
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">Chưa có thông báo</div>
            ) : (
              <div>
                {[...notifications]
                  .sort(
                    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
                  )
                  .slice(0, maxNotifications)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={clsx(
                        'px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
                        !notification.read && 'bg-orange-50',
                      )}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-3">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notification.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {notifications.length > maxNotifications && (
                  <div className="px-4 py-3 text-center">
                    <span
                      className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer"
                      onClick={() => router.push('/user/notification')}
                    >
                      Xem tất cả thông báo
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
