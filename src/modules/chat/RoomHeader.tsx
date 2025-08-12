import { Typography, Box, Paper, Avatar } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

type Props = Readonly<{
  selectedRoom: string;
}>;

const getRoomColor = (roomName: string) => {
  const colors = [
    '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', 
    '#c2185b', '#00796b', '#5d4037', '#455a64'
  ];
  let hash = 0;
  for (let i = 0; i < roomName.length; i++) {
    hash = roomName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function RoomHeader({ selectedRoom }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: '1px solid #e0e0e0',
        px: 2,
        py: 1.5,
        mb: 1
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2
      }}>
        {/* Room Avatar */}
        <Avatar
          sx={{
            bgcolor: getRoomColor(selectedRoom),
            width: 36,
            height: 36,
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'white'
          }}
        >
          {selectedRoom === 'General' ? (
            <img 
              src="/chat-icon.svg" 
              alt="General" 
              style={{ 
                width: '18px', 
                height: '18px',
                filter: 'brightness(0) invert(1)'
              }}
            />
          ) : (
            selectedRoom[0].toUpperCase()
          )}
        </Avatar>
        
        {/* Room Info */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1rem',
              lineHeight: 1.2,
              mb: 0.25
            }}
          >
            {selectedRoom}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <FiberManualRecordIcon 
              sx={{ 
                color: '#4caf50', 
                fontSize: 6 
              }} 
            />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              Active now
            </Typography>
            
            <GroupIcon 
              sx={{ 
                color: 'text.secondary', 
                fontSize: 12,
                ml: 1
              }} 
            />
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              Group chat
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}