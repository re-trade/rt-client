'use client';

import { IconPhoneOff, IconVideo } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface IncomingCallModalProps {
  isOpen: boolean;
  callerName: string;
  callerId: string;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallModal({
  isOpen,
  callerName,
  callerId,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRinging(true);
      // Auto-reject after 30 seconds
      const timeout = setTimeout(() => {
        onReject();
      }, 30000);

      return () => clearTimeout(timeout);
    } else {
      setIsRinging(false);
    }
  }, [isOpen, onReject]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
        {/* Caller Avatar */}
        <div className="relative mb-6">
          <div
            className={`w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold ${
              isRinging ? 'animate-pulse' : ''
            }`}
          >
            {callerName.charAt(0).toUpperCase()}
          </div>
          {isRinging && (
            <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping"></div>
          )}
        </div>

        {/* Caller Info */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{callerName}</h2>
        <p className="text-gray-600 mb-2">Cuộc gọi video đến</p>
        <p className="text-sm text-gray-500 mb-8">Đang gọi...</p>

        {/* Call Actions */}
        <div className="flex justify-center gap-8">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            title="Từ chối cuộc gọi"
          >
            <IconPhoneOff size={28} />
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            title="Chấp nhận cuộc gọi"
          >
            <IconVideo size={28} />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-xs text-gray-400">
          <p>Cuộc gọi sẽ tự động kết thúc sau 30 giây</p>
        </div>
      </div>
    </div>
  );
}
