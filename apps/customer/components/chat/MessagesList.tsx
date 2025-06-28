'use client';

import type { Message } from '@/hooks/use-chat-contact';

interface MessagesListProps {
  messages: Message[];
}

export function MessagesList({ messages }: MessagesListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.sender === 'seller'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <p
              className={`text-xs mt-1 ${message.sender === 'seller' ? 'text-orange-100' : 'text-gray-500'}`}
            >
              {message.timestamp.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
