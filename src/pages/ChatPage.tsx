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
import type { UserSettings } from "../hooks/useSettings";

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

  const handleSettingsChange = (newSettings: UserSettings) => {
    // Handle settings changes if needed
    console.log('Settings updated:', newSettings);
    
    // Apply settings immediately
    applySettings(newSettings);
  };

  const applySettings = (settings: UserSettings) => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply font size
    const fontSizeMap: Record<string, string> = {
      'small': '0.875rem',
      'medium': '1rem',
      'large': '1.125rem',
      'extra-large': '1.25rem'
    };
    
    if (settings.fontSize in fontSizeMap) {
      document.documentElement.style.setProperty('--font-size-base', fontSizeMap[settings.fontSize]);
    }
    
    // Apply compact mode
    document.body.classList.toggle('compact-mode', settings.compactMode);
    
    // Apply animations
    document.body.classList.toggle('no-animations', !settings.messageAnimations);
    
    // Apply notification settings
    if (settings.desktopNotifications && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  // Apply settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings) as UserSettings;
        applySettings(settings);
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
  }, []);

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
        onSettingsChange={handleSettingsChange}
      />
    </Container>
  );
}