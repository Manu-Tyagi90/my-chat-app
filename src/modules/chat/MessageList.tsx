import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Divider,
  Badge,
  Fab
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import type { Message } from "../../types/message";
import { getUserColor } from "../../utils/userColor";
import { socket } from "../../services/socket";
import { useUser } from "../../context/UserContext";

type Props = Readonly<{
  messages: Message[];
  room?: string;
}>;

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const shouldShowDateDivider = (currentMsg: Message, prevMsg: Message | null) => {
  if (!prevMsg) return true;
  
  const currentDate = new Date(currentMsg.timestamp).toDateString();
  const prevDate = new Date(prevMsg.timestamp).toDateString();
  
  return currentDate !== prevDate;
};

const shouldGroupMessages = (currentMsg: Message, prevMsg: Message | null) => {
  if (!prevMsg) return false;
  if (prevMsg.username !== currentMsg.username) return false;
  
  const timeDiff = new Date(currentMsg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime();
  return timeDiff < 5 * 60 * 1000; // 5 minutes
};

const MessageStatus = ({ message, isMe }: { message: Message; isMe: boolean }) => {
  if (!isMe) return null;
  
  const seenCount = message.seenBy?.length || 1;
  const isSeenByMultiple = seenCount > 1;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
      {isSeenByMultiple ? (
        <DoneAllIcon sx={{ fontSize: 14, color: '#4fc3f7' }} />
      ) : (
        <CheckIcon sx={{ fontSize: 14, color: 'grey.500' }} />
      )}
    </Box>
  );
};

const getMessageTailStyle = (isMe: boolean, isGrouped: boolean) => {
  if (isGrouped) return {};
  
  const side = isMe ? 'right' : 'left';
  const borderWidth = isMe ? '0 10px 10px 0' : '0 0 10px 10px';
  const borderColor = isMe 
    ? 'transparent #dcf8c6 transparent transparent'
    : 'transparent transparent #ffffff transparent';
  
  return {
    content: '""',
    position: 'absolute',
    bottom: 3,
    [side]: -8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth,
    borderColor,
  };
};

const MessageBubble = ({ 
  msg, 
  isMe, 
  isGrouped, 
  showAvatar 
}: { 
  msg: Message; 
  isMe: boolean; 
  isGrouped: boolean;
  showAvatar: boolean;
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: isMe ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      mb: isGrouped ? 0.25 : 1,
      px: 1
    }}
  >
    {/* Avatar */}
    <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
      {!isMe && showAvatar && (
        <Avatar
          sx={{
            bgcolor: getUserColor(msg.username),
            width: 32,
            height: 32,
            fontSize: '0.875rem'
          }}
        >
          {msg.username[0].toUpperCase()}
        </Avatar>
      )}
    </Box>

    {/* Message Container */}
    <Box
      sx={{
        maxWidth: '70%',
        position: 'relative'
      }}
    >
      {/* Username (only for others, not grouped) */}
      {!isMe && !isGrouped && (
        <Typography
          variant="caption"
          sx={{
            color: getUserColor(msg.username),
            fontWeight: 600,
            ml: 1,
            mb: 0.25,
            display: 'block'
          }}
        >
          {msg.username}
        </Typography>
      )}

      {/* Message Bubble */}
      <Box
        sx={{
          bgcolor: isMe ? '#dcf8c6' : '#ffffff',
          borderRadius: '18px',
          px: 3,
          py: 1.5,
          position: 'relative',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          border: isMe ? 'none' : '1px solid #e0e0e0',
          '&::before': getMessageTailStyle(isMe, isGrouped)
        }}
      >
        {/* Message Content */}
        <Typography
          variant="body1"
          sx={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.4,
            color: '#000',
            fontSize: '0.95rem'
          }}
        >
          {msg.content}
        </Typography>

        {/* Time and Status */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 0.5,
            gap: 0.5
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'grey.600',
              fontSize: '0.75rem',
              lineHeight: 1
            }}
          >
            {formatTime(msg.timestamp)}
          </Typography>
          <MessageStatus message={msg} isMe={isMe} />
        </Box>
      </Box>
    </Box>
  </Box>
);

const DateDivider = ({ timestamp }: { timestamp: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', my: 2, px: 2 }}>
    <Divider sx={{ flex: 1 }} />
    <Chip
      label={formatDate(timestamp)}
      size="small"
      sx={{
        mx: 2,
        bgcolor: 'grey.100',
        color: 'grey.700',
        fontSize: '0.75rem',
        height: 24
      }}
    />
    <Divider sx={{ flex: 1 }} />
  </Box>
);

const SystemMessage = ({ msg }: { msg: Message }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
    <Chip
      label={msg.content}
      size="small"
      sx={{
        bgcolor: 'grey.100',
        color: 'grey.700',
        fontSize: '0.75rem'
      }}
    />
  </Box>
);

const ScrollToBottomButton = ({ 
  newMessagesCount, 
  onClick 
}: { 
  newMessagesCount: number; 
  onClick: () => void; 
}) => (
  <Box
    sx={{
      position: "absolute",
      bottom: 16,
      right: 16,
      zIndex: 1000
    }}
  >
    <Badge
      badgeContent={newMessagesCount > 0 ? newMessagesCount : null}
      color="error"
      max={99}
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.75rem',
          fontWeight: 600,
          minWidth: 20,
          height: 20
        }
      }}
    >
      <Fab
        size="medium"
        onClick={onClick}
        sx={{
          bgcolor: '#25d366',
          color: 'white',
          boxShadow: 3,
          '&:hover': {
            bgcolor: '#20b358',
          },
          width: 56,
          height: 56
        }}
      >
        <ArrowDownwardIcon />
      </Fab>
    </Badge>
  </Box>
);

const renderMessage = (
  msg: Message, 
  index: number, 
  messages: Message[], 
  user: any
) => {
  const prevMsg = index > 0 ? messages[index - 1] : null;
  const isMe = msg.username === user?.username;
  const isSystem = msg.username === "System";
  const showDateDivider = shouldShowDateDivider(msg, prevMsg);
  const isGrouped = shouldGroupMessages(msg, prevMsg);
  const showAvatar = !isGrouped;
  const key = `${msg.timestamp}-${msg.username}-${index}`;

  return (
    <Box key={key}>
      {showDateDivider && <DateDivider timestamp={msg.timestamp} />}
      {isSystem ? (
        <SystemMessage msg={msg} />
      ) : (
        <MessageBubble 
          msg={msg} 
          isMe={isMe} 
          isGrouped={isGrouped}
          showAvatar={showAvatar}
        />
      )}
    </Box>
  );
};

export default function MessageList({ messages, room }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [lastSeenMessageCount, setLastSeenMessageCount] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const isAtBottom = () => {
    if (!listRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  const handleScroll = () => {
    const atBottom = isAtBottom();
    setShowScrollToBottom(!atBottom);
    
    if (atBottom) {
      setNewMessagesCount(0);
      setLastSeenMessageCount(messages.length);
      setIsUserScrolling(false);
    } else {
      setIsUserScrolling(true);
    }
  };

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessagesCount(0);
    setIsUserScrolling(false);
  };

  useEffect(() => {
    const container = listRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      setShowScrollToBottom(!isAtBottom());
    }
    
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [messages]);

  useEffect(() => {
    const wasAtBottom = !isUserScrolling && isAtBottom();
    
    if (wasAtBottom && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
      setLastSeenMessageCount(messages.length);
    } else if (messages.length > lastSeenMessageCount) {
      const newCount = messages.length - lastSeenMessageCount;
      setNewMessagesCount(prev => prev + newCount);
      setLastSeenMessageCount(messages.length);
    }

    if (user && room && messages.length > 0) {
      socket.emit("seen", { room, username: user.username });
    }
  }, [messages, user, room, lastSeenMessageCount, isUserScrolling]);

  useEffect(() => {
    setLastSeenMessageCount(messages.length);
    setNewMessagesCount(0);
  }, [room]);

  return (
    <Box sx={{ position: "relative", height: '100%', bgcolor: '#f5f5f5' }}>
      <Box
        ref={listRef}
        sx={{
          height: '400px',
          overflowY: "auto",
          px: 0,
          py: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        {messages.map((msg, index) => renderMessage(msg, index, messages, user))}
        <div ref={endRef} />
      </Box>

      {showScrollToBottom && (
        <ScrollToBottomButton 
          newMessagesCount={newMessagesCount}
          onClick={scrollToBottom}
        />
      )}
    </Box>
  );
}