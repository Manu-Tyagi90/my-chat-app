import { useState, useRef } from "react";
import { socket } from "../../services/socket";
import { useUser } from "../../context/UserContext";

type Props = {
  onSend: (content: string) => void;
  room?: string;
};

const MessageInput = ({ onSend, room }: Props) => {
  const [value, setValue] = useState("");
  const { user } = useUser();
  const typingTimeout = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (user && room) {
      socket.emit("typing", { room, username: user.username });

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = window.setTimeout(() => {
        socket.emit("stop_typing", { room, username: user.username });
      }, 1000);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value.trim());
      setValue("");
      if (user && room) socket.emit("stop_typing", { room, username: user.username });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }
  };

  // Emit stop_typing when input loses focus
  const handleBlur = () => {
    if (user && room) socket.emit("stop_typing", { room, username: user.username });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  return (
    <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Type a message..."
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>Send</button>
    </form>
  );
};

export default MessageInput;