'use client';

import NotificationList from '@/components/notification/NotificationList';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <NotificationList />
      </div>
    </div>
  );
}
