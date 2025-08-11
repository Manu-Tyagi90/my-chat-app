import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import MessageList from "../modules/chat/MessageList";
import MessageInput from "../modules/chat/MessageInput";
import RoomList from "../modules/chat/RoomList";
import OnlineUsers from "../modules/chat/OnlineUsers";
import RoomHeader from "../modules/chat/RoomHeader";
import TypingIndicator from "../modules/chat/TypingIndicator";
import type { Message } from "../types/message";
import styles from "./ChatPage.module.css";

function ChatPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<string[]>(["General"]);
  const [selectedRoom, setSelectedRoom] = useState<string>("General");
  const [roomMessages, setRoomMessages] = useState<{ [room: string]: Message[] }>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    socket.connect();
    socket.emit("join", user.username);

    socket.on("room_list", (roomList: string[]) => {
      setRooms(roomList);
      if (!roomList.includes(selectedRoom)) {
        setSelectedRoom("General");
      }
    });

    socket.on("room_message_history", (data: { room: string; messages: Message[] }) => {
      setRoomMessages(prev => ({ ...prev, [data.room]: data.messages }));
    });

    socket.on("receive_message", (data: { room: string; message: Message }) => {
      setRoomMessages(prev => {
        const updated = { ...prev };
        if (!updated[data.room]) updated[data.room] = [];
        updated[data.room] = [...updated[data.room], data.message];
        return updated;
      });
    });

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("user_typing", (username: string) => {
      if (username !== user.username) setTypingUser(username);
    });

    socket.on("user_stop_typing", (username: string) => {
      if (username === typingUser) setTypingUser(null);
    });

    socket.on("seen_update", (data: { room: string; seenBy: string }) => {
      setRoomMessages(prev => {
        const updated = { ...prev };
        if (!updated[data.room]) return updated;
        updated[data.room] = updated[data.room].map(msg => {
          if (!msg.seenBy) msg.seenBy = [];
          if (!msg.seenBy.includes(data.seenBy)) {
            return { ...msg, seenBy: [...msg.seenBy, data.seenBy] };
          }
          return msg;
        });
        return updated;
      });
    });

    socket.emit("join_room", { username: user.username, room: selectedRoom });

    return () => {
      socket.off("room_list");
      socket.off("room_message_history");
      socket.off("receive_message");
      socket.off("online_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("seen_update");
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    socket.emit("join_room", { username: user.username, room: selectedRoom });
  }, [selectedRoom, user]);

  const handleJoinRoom = (room: string) => {
    if (!user) return;
    if (selectedRoom) {
      socket.emit("leave_room", { username: user.username, room: selectedRoom });
    }
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
      seenBy: [user.username], // sender has seen their own message
    };
    if (selectedRoom) {
      socket.emit("send_room_message", { room: selectedRoom, message });
      // Do not update state here! Wait for server event.
    }
  };

  if (!user) return null;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome, {user.username}!</h1>
        <button className={styles.logoutBtn} onClick={logout}>Logout</button>
      </header>

      <nav aria-label="Chat rooms">
        <RoomList
          rooms={rooms}
          selectedRoom={selectedRoom}
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
        />
      </nav>

      <section>
        <OnlineUsers onlineUsers={onlineUsers} />
        <RoomHeader selectedRoom={selectedRoom} />
      </section>

      <section className={styles.main} aria-label="Chat messages">
        <MessageList messages={roomMessages[selectedRoom] || []} room={selectedRoom} />
      </section>

      <footer>
        <TypingIndicator typingUser={typingUser} />
        <MessageInput onSend={handleSend} room={selectedRoom} />
      </footer>
    </main>
  );
}

export default ChatPage;