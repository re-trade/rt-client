'use client';

import type { Room } from '@retrade/util';
import { Search } from 'lucide-react';
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
  const isOnMainChatPage = pathname === '/dashboard/chat';
  const isOnSpecificChatPage =
    pathname.startsWith('/dashboard/chat/') && pathname !== '/dashboard/chat';
  const shouldShowOnMobile = isOnMainChatPage || !isOnSpecificChatPage;

  const filteredContacts = contacts.filter((contact) => {
    const customerParticipant = contact.participants?.find((p: any) => p.senderRole === 'customer');
    return customerParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className={`${shouldShowOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-96 lg:w-80 xl:w-96 bg-white flex-col h-full border-r border-gray-200`}
    >
      <div className="bg-white p-4 md:p-6 border-b border-gray-100">
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Tin nhắn khách hàng</h2>
          <p className="text-sm text-gray-500 mt-1">Cuộc trò chuyện với khách hàng</p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-200 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => {
          const customerParticipant = contact.participants?.find(
            (p: any) => p.senderRole === 'customer',
          );
          const isSelected = selectedContact?.id === contact.id;

          return (
            <div
              key={contact.id}
              onClick={() => onContactSelect(contact)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={customerParticipant?.avatarUrl || '/placeholder.svg'}
                    alt={customerParticipant?.name || 'Customer'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {customerParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">
                    {customerParticipant?.name || 'Khách hàng'}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      customerParticipant?.isOnline ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {customerParticipant?.isOnline ? 'Đang hoạt động' : 'Hoạt động gần đây'}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(contact.updatedAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          );
        })}

        {contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-center text-sm">Chưa có cuộc trò chuyện nào</p>
            <p className="text-center text-xs mt-1">
              Khách hàng sẽ xuất hiện ở đây khi họ nhắn tin cho bạn
            </p>
          </div>
        )}

        {contacts.length > 0 && filteredContacts.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-center text-sm">Không tìm thấy khách hàng</p>
            <p className="text-center text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
}
