'use client';

import type { Contact } from '@/hooks/use-chat-contact';
import { IconSearch } from '@tabler/icons-react';

interface ContactsListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  searchQuery: string;
  onContactSelect: (contact: Contact) => void;
  onSearchChange: (query: string) => void;
}

export function ContactsList({
  contacts,
  selectedContact,
  searchQuery,
  onContactSelect,
  onSearchChange,
}: ContactsListProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <IconSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onContactSelect(contact)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedContact?.id === contact.id
                ? 'bg-orange-50 border-l-4 border-l-orange-500'
                : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={contact.avatar || '/placeholder.svg'}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                  {contact.unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
