import { io } from 'socket.io-client';

let socket;

export function connectSocket() {
  const base = import.meta.env.VITE_API || 'http://localhost:5000';
  socket = io(base, { transports: ['websocket'] });
  return socket;
}

export function getSocket() {
  return socket;
}
