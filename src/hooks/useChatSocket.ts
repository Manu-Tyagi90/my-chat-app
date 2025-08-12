import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import type { Message } from "../types/message";
import { useUser } from "../context/UserContext";

type SocketHandlers = {
  onReceiveMessage: (data: { room: string; message: Message }) => void;
  onRoomList: (roomList: string[]) => void;
  onRoomMessageHistory: (data: { room: string; messages: Message[] }) => void;
  onOnlineUsers: (users: string[]) => void;
  onUserTyping: (username: string) => void;
  onUserStopTyping: (username: string) => void;
  onSeenUpdate: (data: { room: string; seenBy: string }) => void;
};

export function useChatSocket(handlers: SocketHandlers) {
  const { user } = useUser();
  const navigate = useNavigate();
  const handlersRef = useRef(handlers);

  // Update handlers ref when they change
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Connect and join
    socket.connect();
    socket.emit("join", user.username);

    // Set up event listeners
    const setupListeners = () => {
      socket.on("receive_message", (data: { room: string; message: Message }) => handlersRef.current.onReceiveMessage(data));
      socket.on("room_list", (roomList: string[]) => handlersRef.current.onRoomList(roomList));
      socket.on("room_message_history", (data: { room: string; messages: Message[] }) => handlersRef.current.onRoomMessageHistory(data));
      socket.on("online_users", (users: string[]) => handlersRef.current.onOnlineUsers(users));
      socket.on("user_typing", (username: string) => handlersRef.current.onUserTyping(username));
      socket.on("user_stop_typing", (username: string) => handlersRef.current.onUserStopTyping(username));
      socket.on("seen_update", (data: { room: string; seenBy: string }) => handlersRef.current.onSeenUpdate(data));
    };

    const cleanupListeners = () => {
      socket.off("receive_message");
      socket.off("room_list");
      socket.off("room_message_history");
      socket.off("online_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("seen_update");
      socket.disconnect();
    };

    setupListeners();

    return cleanupListeners;
  }, [user, navigate]);

  // Room management
  const joinRoom = (room: string) => {
    if (user) {
      socket.emit("join_room", { username: user.username, room });
    }
  };

  const leaveRoom = (room: string) => {
    if (user) {
      socket.emit("leave_room", { username: user.username, room });
    }
  };

  const createRoom = (roomName: string) => {
    socket.emit("create_room", roomName);
  };

  const sendMessage = (room: string, message: Message) => {
    socket.emit("send_room_message", { room, message });
  };

  return {
    joinRoom,
    leaveRoom,
    createRoom,
    sendMessage
  };
}