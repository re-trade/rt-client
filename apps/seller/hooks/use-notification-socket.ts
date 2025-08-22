'use client';

import { useAuth } from '@/context/AuthContext';
import { createBaseURL, EApiService, ETokenName } from '@retrade/util';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UserNotification {
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
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription[]>([]);

  const mapNotificationType = useCallback((type: string): UserNotification['type'] => {
    switch (type.toUpperCase()) {
      case 'ORDER':
        return 'ORDER';
      case 'ALERT':
        return 'ALERT';
      case 'SYSTEM':
      default:
        return 'SYSTEM';
    }
  }, []);

  const connect = useCallback(() => {
    if (!account?.id) {
      console.log('No seller account ID available, skipping notification connection');
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
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem(ETokenName.ACCESS_TOKEN)}`,
      },
      debug: () => {},
    });

    stompClientRef.current = client;

    client.onConnect = () => {
      setConnected(true);

      subscriptionRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionRef.current = [];

      const sellerNotification = client.subscribe(`/user/queue/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body) as UserNotification;
          setNotifications((prev) => [notification, ...prev]);
        } catch (error) {}
      });

      const globalSellerNotification = client.subscribe(
        `/topic/seller/notifications`,
        (message) => {
          try {
            const notification = JSON.parse(message.body) as UserNotification;
            setNotifications((prev) => [notification, ...prev]);
          } catch (error) {}
        },
      );

      subscriptionRef.current.push(sellerNotification, globalSellerNotification);
    };

    client.onStompError = () => {
      setConnected(false);
    };

    client.onWebSocketError = () => {
      setConnected(false);
    };

    client.activate();
  }, [account, mapNotificationType]);

  const disconnect = useCallback(() => {
    subscriptionRef.current.forEach((sub) => sub.unsubscribe());
    subscriptionRef.current = [];

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
      console.log('Connecting to seller notification service...');

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
