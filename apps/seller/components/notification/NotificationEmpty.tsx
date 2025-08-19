import { Bell } from 'lucide-react';

interface NotificationEmptyProps {
  message?: string;
}

export default function NotificationEmpty({
  message = 'Bạn chưa có thông báo nào',
}: NotificationEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Bell className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
      <p className="text-gray-500 text-center max-w-sm">{message}</p>
    </div>
  );
}
