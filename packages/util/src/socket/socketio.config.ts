import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './type';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3003';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl, {
  transports: ['polling', 'websocket'],
  withCredentials: true,
  autoConnect: false,
  timeout: 5000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  forceNew: false,
  upgrade: true,
  rememberUpgrade: true,
});

if (typeof window !== 'undefined') {
  const connectSocket = () => {
    if (!socket.connected) {
      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('connect_error', (error) => {
        console.log('Socket error:', error);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      socket.connect();
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(connectSocket, 200);
  } else if (document.readyState === 'interactive') {
    window.addEventListener('load', () => {
      setTimeout(connectSocket, 200);
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.addEventListener('load', () => {
        setTimeout(connectSocket, 200);
      });
    });
  }
}
