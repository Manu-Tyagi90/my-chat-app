import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import MessageList from "../modules/chat/MessageList";
import MessageInput from "../modules/chat/MessageInput";
import RoomList from "../modules/chat/RoomList";
import OnlineUsers from "../modules/chat/OnlineUsers";
import RoomHeader from "../modules/chat/RoomHeader";
import TypingIndicator from "../modules/chat/TypingIndicator";
import type { Message } from "../types/message";
import { socket } from "../services/socket";

let notificationSound: HTMLAudioElement | null = null;

if (typeof window !== "undefined") {
  notificationSound = new Audio("/notification.mp3");
}

const playNotificationSound = () => {
  if (!notificationSound) return;
  
  notificationSound.currentTime = 0;
  notificationSound.play().catch(() => {});
};

const showBrowserNotification = (message: Message, room: string) => {
  if (
    "Notification" in window &&
    Notification.permission === "granted" &&
    document.visibilityState !== "visible"
  ) {
    new Notification(
      `${message.username} in ${room}`,
      {
        body: message.content,
        icon: "/favicon.ico"
      }
    );
    playNotificationSound();
  }
};

const checkMessageExists = (messages: Message[], newMessage: Message): boolean => {
  return messages.some(
    (msg) =>
      msg.username === newMessage.username &&
      msg.timestamp === newMessage.timestamp &&
      msg.content === newMessage.content
  );
};

const updateRoomMessages = (
  prevMessages: { [room: string]: Message[] },
  room: string,
  newMessage: Message
): { [room: string]: Message[] } => {
  const roomMessages = prevMessages[room] || [];
  
  if (checkMessageExists(roomMessages, newMessage)) {
    return prevMessages;
  }

  return {
    ...prevMessages,
    [room]: [...roomMessages, newMessage]
  };
};

const updateSeenMessages = (
  prevMessages: { [room: string]: Message[] },
  room: string,
  seenBy: string
): { [room: string]: Message[] } => {
  const roomMessages = prevMessages[room];
  if (!roomMessages) return prevMessages;

  return {
    ...prevMessages,
    [room]: roomMessages.map(msg =>
      !msg.seenBy?.includes(seenBy)
        ? { ...msg, seenBy: [...(msg.seenBy || []), seenBy] }
        : msg
    )
  };
};

export default function ChatPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<string[]>(["General"]);
  const [selectedRoom, setSelectedRoom] = useState<string>("General");
  const [roomMessages, setRoomMessages] = useState<{ [room: string]: Message[] }>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const prevRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleReceiveMessage = (data: { room: string; message: Message }) => {
    setRoomMessages(prev => {
      const updatedMessages = updateRoomMessages(prev, data.room, data.message);
      
      if (data.message.username !== user?.username) {
        showBrowserNotification(data.message, data.room);
      }

      return updatedMessages;
    });
  };

  const handleRoomList = (roomList: string[]) => {
    setRooms(roomList);
  };

  const handleRoomMessageHistory = (data: { room: string; messages: Message[] }) => {
    setRoomMessages(prev => ({ ...prev, [data.room]: data.messages }));
  };

  const handleOnlineUsers = (users: string[]) => {
    setOnlineUsers(users);
  };

  const handleUserTyping = (username: string) => {
    if (username !== user?.username) {
      setTypingUser(username);
    }
  };

  const handleUserStopTyping = (username: string) => {
    if (username === typingUser) {
      setTypingUser(null);
    }
  };

  const handleSeenUpdate = (data: { room: string; seenBy: string }) => {
    setRoomMessages(prev => updateSeenMessages(prev, data.room, data.seenBy));
  };

  const setupSocketListeners = () => {
    socket.on("receive_message", handleReceiveMessage);
    socket.on("room_list", handleRoomList);
    socket.on("room_message_history", handleRoomMessageHistory);
    socket.on("online_users", handleOnlineUsers);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);
    socket.on("seen_update", handleSeenUpdate);
  };

  const cleanupSocketListeners = () => {
    socket.off("receive_message");
    socket.off("room_list");
    socket.off("room_message_history");
    socket.off("online_users");
    socket.off("user_typing");
    socket.off("user_stop_typing");
    socket.off("seen_update");
    socket.disconnect();
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    socket.connect();
    socket.emit("join", user.username);
    setupSocketListeners();

    return cleanupSocketListeners;
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    if (prevRoomRef.current !== selectedRoom) {
      if (prevRoomRef.current) {
        socket.emit("leave_room", { username: user.username, room: prevRoomRef.current });
      }
      socket.emit("join_room", { username: user.username, room: selectedRoom });
      prevRoomRef.current = selectedRoom;
    }
  }, [selectedRoom, user]);

  const handleJoinRoom = (room: string) => {
    if (!user) return;
    setSelectedRoom(room);
  };

  const handleCreateRoom = () => {
    const room = prompt("Enter new room name:");
    if (room && !rooms.includes(room)) {
      socket.emit("create_room", room);
    }
  };

  const handleSend = (content: string) => {
    if (!user) return;

    const timestamp = new Date().toISOString();
    const message: Message = {
      username: user.username,
      content,
      timestamp,
      seenBy: [user.username]
    };

    socket.emit("send_room_message", { room: selectedRoom, message });

    setRoomMessages(prev => ({
      ...prev,
      [selectedRoom]: [...(prev[selectedRoom] || []), message]
    }));
  };

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", minHeight: "85vh", width: "100%", borderRadius: 2, overflow: "hidden" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
          <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            Welcome, {user.username}!
          </Typography>
          <Button variant="contained" color="error" onClick={logout} size="small">
            Logout
          </Button>
        </Stack>

        <RoomList rooms={rooms} selectedRoom={selectedRoom} onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} />
        <OnlineUsers onlineUsers={onlineUsers} />
        <RoomHeader selectedRoom={selectedRoom} />

        <Box flexGrow={1} overflow="auto" mb={2}>
          <MessageList messages={roomMessages[selectedRoom] || []} room={selectedRoom} />
        </Box>

        <TypingIndicator typingUser={typingUser} />

        <Box mt={2}>
          <MessageInput onSend={handleSend} room={selectedRoom} />
        </Box>
      </Paper>
    </Container>
  );
}