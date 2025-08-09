'use client';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createBaseURL, EApiService } from '@retrade/util';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UserNotification {
  id: string;
  title: string;
  content: string;
  type: 'SYSTEM' | 'ORDER' | 'ALERT';
  createdDate: string;
  read: boolean;
}

const webSocketUrl = (): string => {
  const socketUrl: string =
    createBaseURL(EApiService.NOTIFICATION) ?? 'http://localhost:8086/api/v1';
  if (socketUrl) {
    return socketUrl.replace(/^https/, 'wss').replace(/^http/, 'ws') + '/ws';
  }
  return '';
};

export const useNotificationSocket = () => {
  const { account } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const mapNotificationType = useCallback(
    (type: string): 'success' | 'info' | 'warning' | 'error' => {
      switch (type) {
        case 'ORDER':
          return 'success';
        case 'ALERT':
          return 'warning';
        case 'SYSTEM':
        default:
          return 'info';
      }
    },
    [],
  );

  const connect = useCallback(() => {
    if (!account?.id) {
      console.log('No account ID available, skipping notification connection');
      return;
    }

    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    const client = new Client({
      brokerURL: webSocketUrl(),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log(`[STOMP DEBUG] ${msg}`),
    });

    stompClientRef.current = client;

    client.onConnect = () => {
      setConnected(true);

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      subscriptionRef.current = client.subscribe(
        `/user/${account.id}/queue/notifications`,
        (message) => {
          try {
            const notification = JSON.parse(message.body) as UserNotification;
            setNotifications((prev) => [notification, ...prev]);
            showToast(notification.content, mapNotificationType(notification.type));
          } catch (error) {
            console.error('Failed to process notification:', error);
          }
        },
      );
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      setConnected(false);
    };

    client.onWebSocketError = (event) => {
      console.error('WebSocket Error:', event);
      setConnected(false);
    };

    client.activate();
  }, [account, showToast, mapNotificationType]);

  const disconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
    setConnected(false);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }, []);

  useEffect(() => {
    if (account?.id) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [account, connect, disconnect]);

  useEffect(() => {
    if (account?.id) {
      const intervalId = setInterval(() => {
        const client = stompClientRef.current;
        if (client && !client.connected && !client.active) {
          connect();
        }
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [account, connect]);

  return {
    notifications,
    connected,
    markAsRead,
    markAllAsRead,
  };
};
