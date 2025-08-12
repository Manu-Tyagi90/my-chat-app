import { useState, useRef } from "react";
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Popover, 
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { socket } from "../../services/socket";
import { useUser } from "../../context/UserContext";

type Props = Readonly<{
  onSend: (content: string) => void;
  room?: string;
}>;

// Common emojis categorized
const EMOJI_CATEGORIES = {
  faces: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏", "🙌", "🤲", "🙏"],
  hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣"],
  food: ["🍎", "🍌", "🍊", "🍋", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽"],
  symbols: ["💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣", "💬", "🗨️", "🗯️", "💭", "💤", "👋", "✋", "🖐️", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟"]
};

export default function MessageInput({ onSend, room }: Props) {
  const [value, setValue] = useState("");
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(null);
  const [showFileNotification, setShowFileNotification] = useState(false);
  const { user } = useUser();
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);

    if (user && room) {
      socket.emit("typing", { room, username: user.username });

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit("stop_typing", { room, username: user.username });
      }, 1000);
    }
  };

  const handleSend = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (value.trim()) {
      onSend(value.trim());
      setValue("");
      if (user && room) socket.emit("stop_typing", { room, username: user.username });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
    
    if (e.key === 'Escape') {
      setValue("");
      if (user && room) socket.emit("stop_typing", { room, username: user.username });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }
  };

  const handleBlur = () => {
    if (user && room) socket.emit("stop_typing", { room, username: user.username });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  };

  // Emoji picker functions
  const handleEmojiClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchor(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchor(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setValue(prev => prev + emoji);
    handleEmojiClose();
  };

  // File upload notification
  const handleFileUpload = () => {
    setShowFileNotification(true);
  };

  const handleCloseFileNotification = () => {
    setShowFileNotification(false);
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: 1,
          bgcolor: 'white',
          borderRadius: 3,
          mx: 1,
          mb: 1,
          border: '1px solid #e0e0e0'
        }}
      >
        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1
          }}
        >
          {/* Attachment Button */}
          <IconButton
            size="small"
            onClick={handleFileUpload}
            sx={{ 
              color: 'grey.600',
              '&:hover': { 
                bgcolor: 'grey.100',
                color: '#075e54',
                transform: 'rotate(45deg)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <AttachFileIcon />
          </IconButton>

          {/* Message Input */}
          <TextField
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            variant="outlined"
            multiline
            maxRows={4}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f8f9fa',
                fontSize: '0.95rem',
                minHeight: '40px',
                transition: 'all 0.2s ease',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  bgcolor: '#f0f0f0',
                  '& fieldset': {
                    border: 'none',
                  },
                },
                '&.Mui-focused': {
                  bgcolor: 'white',
                  '& fieldset': {
                    border: '2px solid #25d366',
                  },
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 1.5,
                '&::placeholder': {
                  color: '#999',
                  opacity: 1
                }
              }
            }}
          />

          {/* Emoji Button */}
          <IconButton
            size="small"
            onClick={handleEmojiClick}
            sx={{ 
              color: 'grey.600',
              '&:hover': { 
                bgcolor: 'grey.100',
                color: '#f57c00',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <EmojiEmotionsIcon />
          </IconButton>

          {/* Send Button */}
          <IconButton
            type="submit"
            disabled={!value.trim()}
            sx={{
              bgcolor: value.trim() ? '#25d366' : 'grey.300',
              color: 'white',
              width: 42,
              height: 42,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: value.trim() ? '#20b358' : 'grey.400',
                transform: value.trim() ? 'scale(1.05)' : 'none',
              },
              '&:disabled': {
                color: 'white',
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Helper text */}
        {value.length > 0 && (
          <Box sx={{ px: 1, pt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'grey.500', fontSize: '0.7rem' }}>
              Press Enter to send • Shift+Enter for new line • ESC to clear
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Emoji Picker Popover - Fixed Grid issue */}
      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={handleEmojiClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              maxWidth: 320,
              maxHeight: 400,
              borderRadius: 3,
              boxShadow: 3
            }
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
          Choose an Emoji
        </Typography>
        
        {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
          <Box key={category} sx={{ mb: 2 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                textTransform: 'capitalize', 
                fontWeight: 600,
                color: 'text.secondary',
                mb: 1,
                display: 'block'
              }}
            >
              {category}
            </Typography>
            
            {/* Fixed: Using flex layout instead of Grid */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5,
                justifyContent: 'flex-start'
              }}
            >
              {emojis.map((emoji) => (
                <IconButton
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  sx={{
                    fontSize: '1.2rem',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      bgcolor: '#f0f0f0',
                      transform: 'scale(1.2)',
                    },
                    transition: 'all 0.1s ease'
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>
          </Box>
        ))}
      </Popover>

      {/* File Upload Notification */}
      <Snackbar
        open={showFileNotification}
        autoHideDuration={3000}
        onClose={handleCloseFileNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseFileNotification} 
          severity="info" 
          variant="filled"
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.2rem'
            }
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            📎 File upload feature coming soon!
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            We're working on adding file sharing capabilities
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
}