import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './type';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl, {
  transports: ['websocket'],
  withCredentials: true,
});