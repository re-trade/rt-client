'use client';

import { Camera, Paperclip, Send } from 'lucide-react';
import { KeyboardEvent } from 'react';

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onSendImage?: (file: File) => void;
}

export function MessageInput({
  message,
  onMessageChange,
  onSendMessage,
  onSendImage,
}: MessageInputProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onSendImage) {
        onSendImage(file);
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
      if (file && onSendImage) {
        onSendImage(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-white border-t border-gray-100 p-4">
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
            <Camera size={20} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => {
              onMessageChange(e.target.value);
              const target = e.target;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-3xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-200 placeholder-gray-500 text-base resize-none"
            style={{
              minHeight: '48px',
              maxHeight: '120px',
              height: '48px',
              overflowY: 'auto',
            }}
          />
        </div>

        <button
          onClick={onSendMessage}
          disabled={!message.trim()}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-sm group flex-shrink-0"
          title="Gửi tin nhắn"
        >
          <Send size={20} className="group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
