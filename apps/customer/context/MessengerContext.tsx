'use client';

import { useMessenger } from '@/hooks/use-chat-contact';
import { createContext, useContext, type ReactNode } from 'react';

type MessengerContextType = ReturnType<typeof useMessenger>;

const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

export function MessengerProvider({ children }: { children: ReactNode }) {
  const messengerState = useMessenger();

  return <MessengerContext.Provider value={messengerState}>{children}</MessengerContext.Provider>;
}

export function useMessengerContext() {
  const context = useContext(MessengerContext);
  if (context === undefined) {
    throw new Error('useMessengerContext must be used within a MessengerProvider');
  }
  return context;
}
