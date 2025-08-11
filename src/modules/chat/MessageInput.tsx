import { useState, useRef } from "react";
import { Box, TextField, Button } from "@mui/material";
import { socket } from "../../services/socket";
import { useUser } from "../../context/UserContext";

type Props = Readonly<{
  onSend: (content: string) => void;
  room?: string;
}>;

export default function MessageInput({ onSend, room }: Props) {
  const [value, setValue] = useState("");
  const { user } = useUser();
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (user && room) {
      socket.emit("typing", { room, username: user.username });

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
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

  const handleBlur = () => {
    if (user && room) socket.emit("stop_typing", { room, username: user.username });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSend}
      display="flex"
      gap={1}
      alignItems="center"
    >
      <TextField
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Type a message..."
        variant="outlined"
        size="small"
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>
    </Box>
  );
}