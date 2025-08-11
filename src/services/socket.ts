// src/services/socket.ts
import io from "socket.io-client";
//export const socket = io("https://chat-application-socket-io-vite-latest.onrender.com", {
export const socket = io("http://localhost:3000", {
  autoConnect: false,
});