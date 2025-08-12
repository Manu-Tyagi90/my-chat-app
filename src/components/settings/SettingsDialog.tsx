// src/components/settings/SettingsDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import AppearanceSettings from './AppearanceSettings';
import ChatSettings from './ChatSettings';
import PrivacySettings from './PrivacySettings';
import AboutSettings from './AboutSettings';
import ResetConfirmDialog from './ResetConfirmDialog';
import { useSettings, type UserSettings } from "../../hooks/useSettings";

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: UserSettings) => void;
}>;

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'chat' | 'privacy' | 'about';

export default function SettingsDialog({ open, onClose, onSettingsChange }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const { settings, resetSettings } = useSettings();

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    
    // Apply settings
    applySettings();
    
    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
    
    setShowSaveAlert(true);
  };

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
    setShowSaveAlert(true);
  };

  // Apply settings to the app
  const applySettings = () => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Apply font size
    const fontSizeMap: Record<string, string> = {
      'small': '0.875rem',
      'medium': '1rem',
      'large': '1.125rem',
      'extra-large': '1.25rem'
    };
    
    // Fix the type issue by ensuring the key exists
    const fontSize = settings.fontSize;
    if (fontSize in fontSizeMap) {
      document.documentElement.style.setProperty('--font-size-base', fontSizeMap[fontSize]);
    }
    
    // Apply compact mode
    document.body.classList.toggle('compact-mode', settings.compactMode);
    
    // Apply animations
    document.body.classList.toggle('no-animations', !settings.messageAnimations);
    
    // Apply notification settings
    if (settings.desktopNotifications && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  // Apply settings on mount
  useEffect(() => {
    applySettings();
  }, []);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <PersonIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'appearance', label: 'Appearance', icon: <PaletteIcon /> },
    { id: 'chat', label: 'Chat Settings', icon: <ChatIcon /> },
    { id: 'privacy', label: 'Privacy', icon: <SecurityIcon /> },
    { id: 'about', label: 'About', icon: <HelpOutlineIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': 
        return <ProfileSettings />;
      case 'notifications': 
        return <NotificationSettings />;
      case 'appearance': 
        return <AppearanceSettings />;
      case 'chat': 
        return <ChatSettings />;
      case 'privacy': 
        return <PrivacySettings />;
      case 'about': 
        return <AboutSettings onResetClick={() => setShowResetConfirm(true)} />;
      default: 
        return <ProfileSettings />;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              height: isMobile ? '100%' : '80vh',
              borderRadius: isMobile ? 0 : 3,
              m: isMobile ? 0 : 2
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#075e54',
          color: 'white'
        }}>
          <Typography variant="h6" fontWeight={600}>
            Settings
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', height: '100%', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Sidebar */}
          <Box sx={{ 
            width: isMobile ? '100%' : 280, 
            borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
            borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
            bgcolor: '#f8f9fa'
          }}>
            <List sx={{ p: 1 }}>
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={activeTab === item.id}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: '#25d366',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#20b358'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeTab === item.id ? 'white' : 'text.secondary' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {renderContent()}
            </Box>
            
            {/* Save Button */}
            <Box sx={{ 
              p: 3, 
              borderTop: '1px solid #e0e0e0',
              bgcolor: '#f8f9fa',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                sx={{ bgcolor: '#25d366', '&:hover': { bgcolor: '#20b358' } }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Save confirmation */}
      <Snackbar
        open={showSaveAlert}
        autoHideDuration={3000}
        onClose={() => setShowSaveAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSaveAlert(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>

      {/* Reset confirmation dialog */}
      <ResetConfirmDialog 
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />
    </>
  );
}