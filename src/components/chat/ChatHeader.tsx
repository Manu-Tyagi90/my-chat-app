import {
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { getUserColor } from "../../utils/userColor";
import { useUser } from "../../context/UserContext";

type Props = Readonly<{
  onSettingsClick: () => void;
  onLogout: () => void;
}>;

export default function ChatHeader({ onSettingsClick, onLogout }: Props) {
  const { user } = useUser();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleSettingsClick = () => {
    onSettingsClick();
    handleMenuClose();
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#075e54',
        color: 'white',
        borderRadius: 0,
        position: 'relative',
        background: 'linear-gradient(135deg, #075e54 0%, #128c7e 100%)'
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        
        {/* Left Section - Logo and User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* App Logo */}
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <img 
              src="/chat-icon.svg" 
              alt="ChatConnect" 
              style={{ 
                width: '28px', 
                height: '28px',
                filter: 'brightness(0) invert(1)'
              }}
            />
          </Avatar>
          
          {/* User Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.3rem' }, 
                  fontWeight: 600,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Welcome, {user.username}!
              </Typography>
              
              {/* User Status Chip */}
              <Chip
                icon={<PersonIcon sx={{ fontSize: 14, color: '#4caf50' }} />}
                label="Online"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-icon': {
                    color: '#4caf50'
                  }
                }}
              />
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '0.8rem',
                fontWeight: 400,
                letterSpacing: 0.5
              }}
            >
              ChatConnect • Stay Connected Everywhere
            </Typography>
          </Box>
        </Box>
        
        {/* Right Section - User Avatar and Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* User Avatar */}
          <Avatar
            sx={{
              bgcolor: getUserColor(user.username),
              width: 40,
              height: 40,
              fontSize: '1rem',
              fontWeight: 600,
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            {user.username[0].toUpperCase()}
          </Avatar>

          {/* Menu Button */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <MoreVertIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 180,
                  boxShadow: 3
                }
              }
            }}
          >
            <MenuItem disabled sx={{ py: 1 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 2, 
                  bgcolor: getUserColor(user.username),
                  fontSize: '0.875rem'
                }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Currently online
                </Typography>
              </Box>
            </MenuItem>
            
            <MenuItem onClick={handleSettingsClick}>
              <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
              Settings
            </MenuItem>
            
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'error.contrastText'
                }
              }}
            >
              <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Stack>

      {/* Subtle bottom border/gradient */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
        }}
      />
    </Box>
  );
}