import { 
  Paper, 
  Typography, 
  Avatar, 
  Box
} from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { getUserColor } from "../../utils/userColor";

type Props = Readonly<{
  onlineUsers: string[];
}>;

export default function OnlineUsers({ onlineUsers }: Props) {
  if (onlineUsers.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: '1px solid #e0e0e0',
        px: 2,
        py: 1.5
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        mb: 1.5 
      }}>
        <FiberManualRecordIcon 
          sx={{ 
            color: '#4caf50', 
            fontSize: 8 
          }} 
        />
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontWeight: 500
          }}
        >
          {onlineUsers.length} Online
        </Typography>
      </Box>

      {/* Horizontal Scrollable User List */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': {
            height: 4,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#e0e0e0',
            borderRadius: 2,
          },
        }}
      >
        {onlineUsers.map((user) => (
          <Box
            key={user}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 'fit-content',
              cursor: 'pointer',
              '&:hover .user-avatar': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                className="user-avatar"
                sx={{
                  bgcolor: getUserColor(user),
                  width: 40,
                  height: 40,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                  transition: 'transform 0.2s ease',
                  border: '2px solid white',
                  boxShadow: 1
                }}
              >
                {user[0].toUpperCase()}
              </Avatar>
              {/* Online indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#4caf50',
                  border: '2px solid white',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                color: 'text.primary',
                fontWeight: 500,
                maxWidth: 60,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}