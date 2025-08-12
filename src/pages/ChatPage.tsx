import { Container, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import ChatHeader from "../components/chat/ChatHeader";
import ChatContent from "../components/chat/ChatContent";
import Settings from "../components/Settings";
import { useChatSocket } from "../hooks/useChatSocket";
import { useChatMessages } from "../hooks/useChatMessages";
import { useRoomManagement } from "../hooks/useRoomManagement";
import type { Message } from "../types/message";

export default function ChatPage() {
  const { user, logout } = useUser();
  const [rooms, setRooms] = useState<string[]>(["General"]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Message management
  const { roomMessages, addMessage, setRoomHistory, updateSeenStatus } = useChatMessages(user?.username);

  // Socket handlers
  const socketHandlers = {
    onReceiveMessage: (data: { room: string; message: Message }) => {
      addMessage(data.room, data.message);
    },
    onRoomList: (roomList: string[]) => {
      setRooms(roomList);
    },
    onRoomMessageHistory: (data: { room: string; messages: Message[] }) => {
      setRoomHistory(data.room, data.messages);
    },
    onOnlineUsers: (users: string[]) => {
      setOnlineUsers(users);
    },
    onUserTyping: (username: string) => {
      if (username !== user?.username) {
        setTypingUser(username);
      }
    },
    onUserStopTyping: (username: string) => {
      if (username === typingUser) {
        setTypingUser(null);
      }
    },
    onSeenUpdate: (data: { room: string; seenBy: string }) => {
      updateSeenStatus(data.room, data.seenBy);
    }
  };

  // Socket connection
  const { joinRoom, leaveRoom, createRoom, sendMessage } = useChatSocket(socketHandlers);

  // Room management
  const { selectedRoom, handleJoinRoom } = useRoomManagement(joinRoom, leaveRoom);

  // Handlers
  const handleCreateRoom = () => {
    const room = prompt("Enter new room name:");
    if (room && !rooms.includes(room)) {
      createRoom(room);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!user) return;

    const timestamp = new Date().toISOString();
    const message: Message = {
      username: user.username,
      content,
      timestamp,
      seenBy: [user.username]
    };

    sendMessage(selectedRoom, message);
    addMessage(selectedRoom, message);
  };

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 3 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          minHeight: "85vh", 
          width: "100%", 
          borderRadius: 3, 
          overflow: "hidden",
          bgcolor: 'white'
        }}
      >
        <ChatHeader 
          onSettingsClick={() => setShowSettings(true)}
          onLogout={logout}
        />

        <ChatContent
          rooms={rooms}
          selectedRoom={selectedRoom}
          roomMessages={roomMessages}
          onlineUsers={onlineUsers}
          typingUser={typingUser}
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
          onSendMessage={handleSendMessage}
        />
      </Paper>

      <Settings 
        open={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </Container>
  );
}