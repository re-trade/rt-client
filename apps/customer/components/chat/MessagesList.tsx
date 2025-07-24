'use client';

import type { Message } from '@/types/chat/chat';
import { useEffect, useRef, useState } from 'react';

interface MessagesListProps {
  messages: Message[];
}

export function MessagesList({ messages }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (shouldAutoScroll && !isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll, isUserScrolling]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;

    setShouldAutoScroll(isAtBottom);
    setIsUserScrolling(true);
    setTimeout(() => setIsUserScrolling(false), 1000);
  };
  return (
    <div className="h-full relative">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 scroll-smooth overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender?.senderRole === 'customer' ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`max-w-md lg:max-w-xl xl:max-w-2xl px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
                  message.sender?.senderRole === 'customer'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 rounded-bl-md'
                }`}
              >
                <p className="text-base leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender?.senderRole === 'customer' ? 'text-orange-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

        <div ref={messagesEndRef} />

        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có tin nhắn</h3>
              <p className="text-gray-500">
                Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên
              </p>
            </div>
          </div>
        )}
      </div>

      {!shouldAutoScroll && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10"
          title="Cuộn xuống cuối"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
