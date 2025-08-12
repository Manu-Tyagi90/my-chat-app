import { Typography, Box, Avatar, Paper } from "@mui/material";
import { getUserColor } from "../../utils/userColor";

type Props = Readonly<{
  typingUser: string | null;
}>;

const TypingDots = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
    <Box
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: '#90a4ae',
        animation: 'typing 1.4s infinite ease-in-out',
        animationDelay: '0s'
      }}
    />
    <Box
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: '#90a4ae',
        animation: 'typing 1.4s infinite ease-in-out',
        animationDelay: '0.2s'
      }}
    />
    <Box
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: '#90a4ae',
        animation: 'typing 1.4s infinite ease-in-out',
        animationDelay: '0.4s'
      }}
    />
    
    {/* CSS Animation */}
    <style>
      {`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}
    </style>
  </Box>
);

export default function TypingIndicator({ typingUser }: Props) {
  if (!typingUser) return null;

  return (
    <Box 
      sx={{ 
        px: 2, 
        py: 1,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#f5f5f5',
          borderRadius: '18px 18px 18px 4px',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          border: '1px solid #e0e0e0',
          position: 'relative',
          maxWidth: '200px',
          
          // Message tail
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 3,
            left: -8,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 0 10px 10px',
            borderColor: 'transparent transparent #f5f5f5 transparent',
          }
        }}
      >
        {/* User Avatar */}
        <Avatar
          sx={{
            bgcolor: getUserColor(typingUser),
            width: 24,
            height: 24,
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'white'
          }}
        >
          {typingUser[0].toUpperCase()}
        </Avatar>

        {/* Typing Text and Animation */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.primary',
              fontSize: '0.75rem',
              fontWeight: 500,
              lineHeight: 1.2,
              mb: 0.25
            }}
          >
            {typingUser}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.7rem',
                fontStyle: 'italic'
              }}
            >
              typing
            </Typography>
            <TypingDots />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}