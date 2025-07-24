'use client';

import type { Message } from '@retrade/util';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TypingIndicator } from './TypingIndicator';

interface MessagesListProps {
  messages: Message[];
  isSomeoneTyping?: boolean;
  typingUser?: string | null;
}

export function MessagesList({ messages, isSomeoneTyping = false, typingUser }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (shouldAutoScroll && !isUserScrolling) {
      // Use a small delay to ensure DOM has updated
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages, shouldAutoScroll, isUserScrolling, isSomeoneTyping]);

  // Auto-scroll to bottom when component first mounts with messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50; // Reduced threshold for better detection

    setShouldAutoScroll(isAtBottom);
    setIsUserScrolling(true);

    // Clear previous timeout and set new one
    setTimeout(() => setIsUserScrolling(false), 1500);
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
              className={`flex ${message.sender?.senderRole === 'seller' ? 'justify-end' : 'justify-start'} group`}
            >
              <div
                className={`max-w-md lg:max-w-xl xl:max-w-2xl px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md ${
                  message.sender?.senderRole === 'seller'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 rounded-bl-md'
                }`}
              >
                <p className="text-base leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.sender?.senderRole === 'seller' ? 'text-orange-100' : 'text-gray-500'
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

        {/* Typing Indicator */}
        <TypingIndicator isTyping={isSomeoneTyping} typingUser={typingUser} className="mb-2" />

        <div ref={messagesEndRef} />

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm mx-auto p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bắt đầu cuộc trò chuyện</h3>
              <p className="text-gray-600 text-sm">
                Gửi tin nhắn đầu tiên để bắt đầu trò chuyện với khách hàng
              </p>
            </div>
          </div>
        )}
      </div>

      {!shouldAutoScroll && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Cuộn xuống cuối"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
}
