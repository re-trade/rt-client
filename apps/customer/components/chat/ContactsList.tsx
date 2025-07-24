'use client';

import type { Room } from '@/types/chat/chat';
import { IconSearch } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

interface ContactsListProps {
  contacts: Room[];
  selectedContact: Room | null;
  searchQuery: string;
  onContactSelect: (contact: Room) => void;
  onSearchChange: (query: string) => void;
}

export function ContactsList({
  contacts,
  selectedContact,
  searchQuery,
  onContactSelect,
  onSearchChange,
}: ContactsListProps) {
  const pathname = usePathname();
  const isOnMainChatPage = pathname === '/chat';
  const isOnSpecificChatPage = pathname.startsWith('/chat/') && pathname !== '/chat';
  const shouldShowOnMobile = isOnMainChatPage || !isOnSpecificChatPage;

  return (
    <div
      className={`${shouldShowOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-96 lg:w-80 xl:w-96 bg-white flex-col h-full border-r border-gray-200`}
    >
      <div className="bg-white p-4 md:p-6 border-b border-gray-100">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Tin nhắn</h2>
          <p className="text-sm text-gray-500 mt-1">Cuộc trò chuyện gần đây</p>
        </div>
        <div className="relative">
          <IconSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-200 text-base"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        {contacts
          .filter((contact) => {
            if (!searchQuery) return true;
            const otherParticipant = contact.participants
              .filter((item: any) => item.senderRole === 'seller')
              .pop();
            return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
          })
          .map((contact) => {
            const otherParticipant = contact.participants
              .filter((item: any) => item.senderRole === 'seller')
              .pop();
            return (
              <div
                key={contact.id}
                onClick={() => onContactSelect(contact)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all duration-200 group ${
                  selectedContact?.id === contact.id
                    ? 'bg-orange-50 border-r-4 border-r-orange-500'
                    : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={otherParticipant?.avatarUrl || '/placeholder.svg'}
                      alt={otherParticipant?.name || 'Contact'}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {otherParticipant?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-semibold text-base truncate transition-colors duration-200 ${
                          selectedContact?.id === contact.id ? 'text-orange-600' : 'text-gray-900'
                        }`}
                      >
                        {otherParticipant?.name || 'Contact'}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {new Date(contact.updatedAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">Nhấn để bắt đầu trò chuyện</p>
                      {selectedContact?.id === contact.id && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {contacts.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có cuộc trò chuyện</h3>
              <p className="text-gray-500 text-sm">Bắt đầu mua sắm để nhắn tin với người bán</p>
            </div>
          </div>
        )}

        {contacts.length > 0 &&
          contacts.filter((contact) => {
            if (!searchQuery) return true;
            const otherParticipant = contact.participants
              .filter((item: any) => item.senderRole === 'seller')
              .pop();
            return otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
          }).length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 text-sm">Thử tìm kiếm với từ khóa khác</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
