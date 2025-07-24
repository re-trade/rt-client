'use client';

import { ContactsList } from '@/components/chat/ContactsList';
import { MessengerProvider, useMessengerContext } from '@/context/MessengerContext';
import type React from 'react';

function MessengerLayoutContent({ children }: { children: React.ReactNode }) {
  const { contacts, selectedContact, searchQuery, setSelectedContact, setSearchQuery, audioRef } =
    useMessengerContext();

  return (
    <div className="bg-gray-50 py-4 md:py-8 px-2 md:px-4">
      <audio ref={audioRef} loop>
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          type="audio/wav"
        />
      </audio>

      <div className="flex w-full mx-auto shadow-lg md:rounded-xl overflow-hidden bg-white border-0 md:border border-gray-200 md:max-w-none lg:max-w-[95vw] xl:max-w-[90vw] h-[calc(100vh-32px)] md:h-[80vh] min-h-[650px]">
        <ContactsList
          contacts={contacts}
          selectedContact={selectedContact}
          searchQuery={searchQuery}
          onContactSelect={setSelectedContact}
          onSearchChange={setSearchQuery}
        />

        <div className="flex-1 flex flex-col border-l border-gray-200">{children}</div>
      </div>
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
