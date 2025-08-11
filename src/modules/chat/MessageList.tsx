import { useEffect, useRef, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  Button
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { Message } from "../../types/message";
import { getUserColor } from "../../utils/userColor";
import { socket } from "../../services/socket";
import { useUser } from "../../context/UserContext";

type Props = {
  messages: Message[];
  room?: string;
};

export default function MessageList({ messages, room }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const { user } = useUser();
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Helper: Check if user is at (or near) the bottom
  const isAtBottom = () => {
    if (!listRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    return scrollHeight - scrollTop - clientHeight < 30;
  };

  // Scroll event: show/hide scroll-to-bottom button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToBottom(!isAtBottom());
    };
    const list = listRef.current;
    if (list) {
      list.addEventListener("scroll", handleScroll);
      setShowScrollToBottom(!isAtBottom());
    }
    return () => {
      if (list) list.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  // Auto-scroll only if user is at bottom
  useEffect(() => {
    if (isAtBottom() && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (user && room && messages.length > 0) {
      socket.emit("seen", { room, username: user.username });
    }
    // eslint-disable-next-line
  }, [messages]);

  return (
    <Box sx={{ position: "relative" }}>
      <List
        ref={listRef}
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 1,
          p: 1,
          mb: 0
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.username === user?.username;
          const isSystem = msg.username === "System";
          const key = msg.timestamp + msg.username;

          if (isSystem) {
            return (
              <ListItem key={key} sx={{ justifyContent: "center" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    textAlign: "center",
                    whiteSpace: "pre-line"
                  }}
                >
                  {msg.content}
                </Typography>
              </ListItem>
            );
          }

          return (
            <ListItem
              key={key}
              alignItems="flex-start" // Only "flex-start" or "center" allowed
              sx={{
                flexDirection: isMe ? "row-reverse" : "row",
                textAlign: isMe ? "right" : "left",
                border: "none",
                background: "none"
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: getUserColor(msg.username),
                    color: "#fff"
                  }}
                >
                  {msg.username[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              {/* Bubble with tail */}
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  maxWidth: "80%",
                  ml: isMe ? "auto" : 0,
                  mr: isMe ? 0 : "auto",
                  mb: 0.5,
                  bgcolor: isMe ? "primary.main" : "grey.100",
                  color: isMe ? "#fff" : "text.primary",
                  borderRadius: isMe
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  px: 2,
                  py: 1,
                  boxShadow: 1,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    right: isMe ? -10 : "auto",
                    left: isMe ? "auto" : -10,
                    width: 0,
                    height: 0,
                    borderTop: "10px solid transparent",
                    borderBottom: "10px solid transparent",
                    borderLeft: isMe ? "10px solid #1976d2" : "none",
                    borderRight: !isMe ? "10px solid #e0e0e0" : "none"
                  }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    gap: 1,
                    mb: 0.5
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    color={isMe ? "#fff" : "primary"}
                    variant="body2"
                    sx={{
                      flexShrink: 0,
                      '@media (max-width:600px)': { fontSize: "0.75rem" }
                    }}
                  >
                    {msg.username}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={isMe ? "#e3f2fd" : "text.secondary"}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    color: isMe ? "#fff" : "text.primary",
                    '@media (max-width:600px)': {
                      fontSize: "0.85rem"
                    }
                  }}
                >
                  {msg.content}
                </Typography>
                {msg.seenBy && room && msg.seenBy.length > 1 && (
                  <Chip
                    label={`✓ Seen by ${msg.seenBy.length}`}
                    size="small"
                    color="success"
                    sx={{
                      mt: 0.5,
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      background: isMe ? "#fff" : "#e0f2f1",
                      color: isMe ? "#1976d2" : "#388e3c"
                    }}
                  />
                )}
              </Box>
            </ListItem>
          );
        })}
        <div ref={endRef} />
      </List>
      {showScrollToBottom && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none"
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ArrowDownwardIcon />}
            sx={{
              pointerEvents: "auto",
              borderRadius: 20,
              boxShadow: 2,
              minWidth: 0,
              px: 2
            }}
            onClick={() => {
              endRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            New messages
          </Button>
        </Box>
      )}
    </Box>
  );
}