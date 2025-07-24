'use client';

import { CameraIcon, Paperclip, Send } from 'lucide-react';
import type React from 'react';

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  isLoading?: boolean;
}

export function MessageInput({
  message,
  onMessageChange,
  onSendMessage,
  isLoading = false,
}: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSendMessage();
      }
    }
  };

  const handleFileAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('File selected:', file.name);
      }
    };
    input.click();
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Image captured:', file.name);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white border-t border-gray-100 px-4 py-4">
      <div className="flex items-end gap-3 max-w-6xl mx-auto">
        <div className="flex gap-2">
          <button
            onClick={handleFileAttachment}
            className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
            title="Đính kèm tệp"
          >
            <Paperclip
              size={20}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </button>
          <button
            onClick={handleCameraCapture}
            className="p-3 text-gray-600 hover:text-white hover:bg-orange-500 rounded-full transition-all duration-200 group"
            title="Chụp ảnh"
          >
            <CameraIcon
              size={20}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </button>
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-3xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-200 placeholder-gray-500 text-base"
          />
        </div>
        <button
          onClick={onSendMessage}
          disabled={!message.trim() || isLoading}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-sm group flex-shrink-0"
          title="Gửi tin nhắn"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={20} className="group-hover:scale-110 transition-transform duration-200" />
          )}
        </button>
      </div>
    </div>
  );
}
