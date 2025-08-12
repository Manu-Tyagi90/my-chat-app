import { 
  Button, 
  Paper, 
  Box, 
  Avatar,
  IconButton,
  Chip,
  Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';

type Props = Readonly<{
  rooms: string[];
  selectedRoom: string;
  onJoinRoom: (room: string) => void;
  onCreateRoom: () => void;
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

const RoomButton = ({ 
  room, 
  isSelected, 
  onClick 
}: { 
  room: string; 
  isSelected: boolean; 
  onClick: () => void; 
}) => (
  <Button
    onClick={onClick}
    sx={{
      minWidth: 'fit-content',
      height: 42,
      px: 2.5,
      py: 1,
      borderRadius: 21,
      bgcolor: isSelected ? '#075e54' : 'transparent',
      color: isSelected ? 'white' : 'text.primary',
      border: isSelected ? 'none' : '1px solid #e0e0e0',
      textTransform: 'none',
      fontWeight: isSelected ? 600 : 500,
      fontSize: '0.875rem',
      boxShadow: isSelected ? 1 : 0,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: isSelected ? '#054740' : '#f8f9fa',
        transform: 'translateY(-1px)',
        boxShadow: 2
      },
      '&:active': {
        transform: 'translateY(0)',
      }
    }}
  >
    <Avatar
      sx={{
        bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : getRoomColor(room),
        width: 24,
        height: 24,
        fontSize: '0.7rem',
        mr: 1,
        transition: 'all 0.2s ease'
      }}
    >
      {room === 'General' ? (
        <img 
          src="/chat-icon.svg" 
          alt="General" 
          style={{ 
            width: '12px', 
            height: '12px', 
            filter: isSelected ? 'brightness(0) invert(1)' : 'none'
          }}
        />
      ) : (
        room[0].toUpperCase()
      )}
    </Avatar>
    {room}
    {isSelected && (
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: '#25d366',
          ml: 1,
          animation: 'pulse 2s infinite'
        }}
      />
    )}
  </Button>
);

const CreateRoomButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      bgcolor: '#25d366',
      color: 'white',
      width: 42,
      height: 42,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: '#20b358',
        transform: 'scale(1.05)',
        boxShadow: 3
      },
      '&:active': {
        transform: 'scale(0.95)',
      }
    }}
  >
    <AddIcon sx={{ fontSize: 20 }} />
  </IconButton>
);

export default function RoomList({
  rooms,
  selectedRoom,
  onJoinRoom,
  onCreateRoom
}: Props) {
  return (
    <>
      {/* CSS for animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          px: 2,
          py: 1.5
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 1.5 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TagIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              Chat Rooms
            </Typography>
          </Box>
          
          <Chip
            label={`${rooms.length} rooms`}
            size="small"
            sx={{
              bgcolor: '#f0f0f0',
              color: 'text.secondary',
              fontSize: '0.7rem',
              fontWeight: 500,
              height: 18
            }}
          />
        </Box>

        {/* Rooms List */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
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
          {rooms.map((room) => (
            <RoomButton
              key={room}
              room={room}
              isSelected={room === selectedRoom}
              onClick={() => onJoinRoom(room)}
            />
          ))}
          
          <CreateRoomButton onClick={onCreateRoom} />
        </Box>
      </Paper>
    </>
  );
}