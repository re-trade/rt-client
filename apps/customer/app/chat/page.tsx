'use client';

import { IconSend } from '@tabler/icons-react';

export default function MessengerPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconSend className="text-orange-500" size={32} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Chào mừng đến với Chat</h2>
        <p className="text-gray-600">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
      </div>
    </div>
  );
}
