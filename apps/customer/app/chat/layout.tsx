'use client';

import { ContactsList } from '@/components/chat/ContactsList';
import { MessengerProvider, useMessengerContext } from '@/context/MessengerContext';
import type React from 'react';

function MessengerLayoutContent({ children }: { children: React.ReactNode }) {
  const { contacts, selectedContact, searchQuery, setSelectedContact, setSearchQuery, audioRef } =
    useMessengerContext();

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Audio element for call sounds */}
      <audio ref={audioRef} loop>
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          type="audio/wav"
        />
      </audio>

      {/* Sidebar - Contacts List */}
      <ContactsList
        contacts={contacts}
        selectedContact={selectedContact}
        searchQuery={searchQuery}
        onContactSelect={setSelectedContact}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      {children}
    </div>
  );
}

export default function MessengerLayout({ children }: { children: React.ReactNode }) {
  return (
    <MessengerProvider>
      <MessengerLayoutContent>{children}</MessengerLayoutContent>
    </MessengerProvider>
  );
}
