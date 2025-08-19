'use client';

import { NotificationFilters } from '@/hooks/use-notifications';
import { getNotificationIcon } from '@/lib/notification-utils';
import { NotificationResponse } from '@/services/notification.api';
import { Eye, EyeOff, Filter, List } from 'lucide-react';
import { useState } from 'react';

interface NotificationFilterProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: NotificationFilters) => void;
  notificationCounts?: {
    total: number;
    unread: number;
    byType: Record<NotificationResponse['type'], number>;
  };
}

const filterOptions = [
  { value: 'ALL', label: 'Tất cả', icon: Filter },
  { value: 'ORDER', label: 'Đơn hàng', icon: null },
  { value: 'ALERT', label: 'Cảnh báo', icon: null },
  { value: 'SYSTEM', label: 'Hệ thống', icon: null },
] as const;

const readStatusOptions = [
  { value: undefined, label: 'Tất cả', icon: List },
  { value: false, label: 'Chưa đọc', icon: EyeOff },
  { value: true, label: 'Đã đọc', icon: Eye },
] as const;

export default function NotificationFilter({
  filters,
  onFiltersChange,
  notificationCounts,
}: NotificationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeChange = (type: NotificationFilters['type']) => {
    onFiltersChange({ ...filters, type });
  };

  const handleReadStatusChange = (read: NotificationFilters['read']) => {
    onFiltersChange({ ...filters, read });
  };

  const getTypeCount = (type: string) => {
    try {
      if (!notificationCounts) return 0;
      if (type === 'ALL') return notificationCounts.total || 0;
      return notificationCounts.byType?.[type as NotificationResponse['type']] || 0;
    } catch (error) {
      console.warn('Error calculating type count:', error);
      return 0;
    }
  };

  const getReadStatusCount = (read: boolean | undefined) => {
    try {
      if (!notificationCounts) return 0;
      if (read === undefined) return notificationCounts.total || 0;
      if (read === false) return notificationCounts.unread || 0;
      return Math.max(0, (notificationCounts.total || 0) - (notificationCounts.unread || 0));
    } catch (error) {
      console.warn('Error calculating read status count:', error);
      return 0;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-orange-200 p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600 flex-shrink-0" />
          <span className="truncate">Bộ lọc thông báo</span>
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-orange-50 transition-colors flex-shrink-0"
        >
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className={`space-y-4 lg:space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Read Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Trạng thái đọc</h4>
          <div className="grid grid-cols-1 gap-2">
            {readStatusOptions.map((option) => {
              const isActive = filters.read === option.value;
              const count = getReadStatusCount(option.value);
              const IconComponent = option.icon;

              return (
                <button
                  key={option.label}
                  onClick={() => handleReadStatusChange(option.value)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 min-w-0 ${
                    isActive
                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-25'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <IconComponent
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-orange-600' : 'text-gray-500'
                      }`}
                    />
                    <span className="text-sm font-medium truncate">{option.label}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                      isActive ? 'bg-orange-200 text-orange-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Loại thông báo</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
            {filterOptions.map((option) => {
              const isActive = filters.type === option.value;
              const count = getTypeCount(option.value);
              const IconComponent =
                option.icon || getNotificationIcon(option.value as NotificationResponse['type']);

              return (
                <button
                  key={option.value}
                  onClick={() => handleTypeChange(option.value as NotificationFilters['type'])}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 min-w-0 ${
                    isActive
                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-25'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{option.label}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                      isActive ? 'bg-orange-200 text-orange-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Filters */}
        {(filters.type !== 'ALL' || filters.read !== undefined) && (
          <button
            onClick={() => onFiltersChange({ type: 'ALL', read: undefined })}
            className="w-full p-2 lg:p-3 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
