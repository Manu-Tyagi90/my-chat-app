// src/services/socket.ts
import io from "socket.io-client";
export const socket = io("https://chat-application-socket-io-vite-latest.onrender.com", {
  autoConnect: false,
});