'use client';

import { useNotificationSocket } from '@/hooks/use-notification-socket';
import { createContext, ReactNode, useContext } from 'react';

type NotificationContextType = ReturnType<typeof useNotificationSocket>;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationHook = useNotificationSocket();

  return (
    <NotificationContext.Provider value={notificationHook}>{children}</NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
