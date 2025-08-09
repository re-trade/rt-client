'use client';

import { useNotificationSocket } from '@/hooks/use-notification-socket';
import { ReactNode } from 'react';

export function NotificationProvider({ children }: { children: ReactNode }) {
  useNotificationSocket();
  return <>{children}</>;
}
