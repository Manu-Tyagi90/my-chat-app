import { useEffect, useRef } from "react";
import type { Message } from "../../types/message";
import { getUserColor } from "../../utils/userColor";
import { socket } from "../../services/socket";
import { useUser } from "../../context/UserContext";

type Props = {
  messages: Message[];
  room?: string;
};

const MessageList = ({ messages, room }: Props) => {
  const endRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
      if (user && room && messages.length > 0) {
        socket.emit("seen", { room, username: user.username });
      }
    }
  }, [messages, user, room]);

  return (
    <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
      {messages.map((msg, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: getUserColor(msg.username),
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              marginRight: 8,
              fontSize: 16,
              flexShrink: 0,
            }}
            title={msg.username}
          >
            {msg.username[0].toUpperCase()}
          </div>
          <div>
            <strong style={{ color: getUserColor(msg.username) }}>
              {msg.username}:
            </strong>{" "}
            {msg.content}
            <div style={{ fontSize: 10, color: "#888" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
              {msg.seenBy && room && msg.seenBy.length > 1 && (
                <span style={{ marginLeft: 8, color: "#4caf50", fontWeight: "bold" }}>
                  ✓ Seen by {msg.seenBy.length}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;