import { Box } from "@mui/material";
import RoomList from "../../modules/chat/RoomList";
import OnlineUsers from "../../modules/chat/OnlineUsers";
import RoomHeader from "../../modules/chat/RoomHeader";
import MessageList from "../../modules/chat/MessageList";
import TypingIndicator from "../../modules/chat/TypingIndicator";
import MessageInput from "../../modules/chat/MessageInput";
import type { Message } from "../../types/message";

type Props = Readonly<{
  rooms: string[];
  selectedRoom: string;
  roomMessages: { [room: string]: Message[] };
  onlineUsers: string[];
  typingUser: string | null;
  onJoinRoom: (room: string) => void;
  onCreateRoom: () => void;
  onSendMessage: (content: string) => void;
}>;

export default function ChatContent({
  rooms,
  selectedRoom,
  roomMessages,
  onlineUsers,
  typingUser,
  onJoinRoom,
  onCreateRoom,
  onSendMessage
}: Props) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 1, sm: 2 } }}>
      <RoomList 
        rooms={rooms} 
        selectedRoom={selectedRoom} 
        onJoinRoom={onJoinRoom} 
        onCreateRoom={onCreateRoom} 
      />
      
      <OnlineUsers onlineUsers={onlineUsers} />
      
      <RoomHeader selectedRoom={selectedRoom} />

      <Box flexGrow={1} overflow="auto" mb={2}>
        <MessageList messages={roomMessages[selectedRoom] || []} room={selectedRoom} />
      </Box>

      <TypingIndicator typingUser={typingUser} />

      <MessageInput onSend={onSendMessage} room={selectedRoom} />
    </Box>
  );
}