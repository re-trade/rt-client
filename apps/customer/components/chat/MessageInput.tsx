'use client';

import type React from 'react';

import { IconPaperclip, IconPhoto, IconSend } from '@tabler/icons-react';

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export function MessageInput({ message, onMessageChange, onSendMessage }: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
          <IconPaperclip size={20} />
        </button>
        <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
          <IconPhoto size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
        </div>
        <button
          onClick={onSendMessage}
          disabled={!message.trim()}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconSend size={20} />
        </button>
      </div>
    </div>
  );
}
