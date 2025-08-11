import { useEffect, useRef } from "react";
import type { Message } from "../../types/message";
import { getUserColor } from "../../utils/userColor";
import { socket } from "../../services/socket";
import { useUser } from "../../context/UserContext";
import styles from "./MessageList.module.css";

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
    <section className={styles.list} aria-label="Messages">
      {messages.map((msg, idx) => (
        <article key={idx} className={styles.messageRow}>
          <div
            className={styles.avatar}
            style={{ background: getUserColor(msg.username) }}
            title={msg.username}
            aria-label={`Avatar for ${msg.username}`}
          >
            {msg.username[0].toUpperCase()}
          </div>
          <div className={styles.content}>
            <span className={styles.username} style={{ color: getUserColor(msg.username) }}>
              {msg.username}:
            </span>
            <span className={styles.text}>{msg.content}</span>
            <time className={styles.timestamp} dateTime={msg.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
              {msg.seenBy && room && msg.seenBy.length > 1 && (
                <span className={styles.seen}>
                  ✓ Seen by {msg.seenBy.length}
                </span>
              )}
            </time>
          </div>
        </article>
      ))}
      <div ref={endRef} />
    </section>
  );
};

export default MessageList;