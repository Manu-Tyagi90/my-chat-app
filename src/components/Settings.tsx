import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Button,
  Avatar,
  Paper,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import ChatIcon from '@mui/icons-material/Chat';
import SecurityIcon from '@mui/icons-material/Security';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import LanguageIcon from '@mui/icons-material/Language';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import { getUserColor } from "../utils/userColor";
import { useUser } from "../context/UserContext";

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

type SettingsTab = 'profile' | 'notifications' | 'appearance' | 'chat' | 'privacy' | 'about';

export default function Settings({ open, onClose }: Props) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // Profile settings
    username: user?.username || '',
    status: 'Available',
    
    // Notification settings
    soundEnabled: true,
    desktopNotifications: true,
    messagePreview: true,
    muteDuringCalls: false,
    notificationVolume: 70,
    
    // Appearance settings
    theme: 'light',
    fontSize: 'medium',
    messageAnimations: true,
    compactMode: false,
    
    // Chat settings
    enterToSend: true,
    typingIndicators: true,
    readReceipts: true,
    messageHistory: 1000,
    autoDownload: 'wifi',
    
    // Privacy settings
    lastSeenVisibility: 'everyone',
    profilePhotoVisibility: 'everyone',
    whoCanAddMe: 'everyone',
  });

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: <PersonIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'appearance', label: 'Appearance', icon: <PaletteIcon /> },
    { id: 'chat', label: 'Chat Settings', icon: <ChatIcon /> },
    { id: 'privacy', label: 'Privacy', icon: <SecurityIcon /> },
    { id: 'about', label: 'About', icon: <HelpOutlineIcon /> },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Here you would save settings to localStorage or send to backend
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    setShowSaveAlert(true);
  };

  const renderProfileSettings = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Profile Settings
      </Typography>
      
      {/* Profile Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: getUserColor(settings.username),
            fontSize: '2rem',
            fontWeight: 600
          }}
        >
          {settings.username[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {settings.username}
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }}>
            Change Avatar
          </Button>
        </Box>
      </Box>

      {/* Username */}
      <TextField
        label="Username"
        value={settings.username}
        onChange={(e) => handleSettingChange('username', e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        helperText="This is how others will see you in chat"
      />

      {/* Status */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={settings.status}
          onChange={(e) => handleSettingChange('status', e.target.value)}
          label="Status"
        >
          <MenuItem value="Available">🟢 Available</MenuItem>
          <MenuItem value="Busy">🔴 Busy</MenuItem>
          <MenuItem value="Away">🟡 Away</MenuItem>
          <MenuItem value="Invisible">⚫ Invisible</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderNotificationSettings = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Notification Settings
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <VolumeUpIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Sound Notifications"
            secondary="Play sound for new messages"
          />
          <Switch
            checked={settings.soundEnabled}
            onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Desktop Notifications"
            secondary="Show notifications when app is in background"
          />
          <Switch
            checked={settings.desktopNotifications}
            onChange={(e) => handleSettingChange('desktopNotifications', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Message Preview"
            secondary="Show message content in notifications"
          />
          <Switch
            checked={settings.messagePreview}
            onChange={(e) => handleSettingChange('messagePreview', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Mute During Calls"
            secondary="Disable notifications during voice/video calls"
          />
          <Switch
            checked={settings.muteDuringCalls}
            onChange={(e) => handleSettingChange('muteDuringCalls', e.target.checked)}
          />
        </ListItem>
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Notification Volume: {settings.notificationVolume}%
        </Typography>
        <Slider
          value={settings.notificationVolume}
          onChange={(_, value) => handleSettingChange('notificationVolume', value)}
          min={0}
          max={100}
          sx={{ color: '#25d366' }}
        />
      </Box>
    </Box>
  );

  const renderAppearanceSettings = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Appearance Settings
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={settings.theme}
          onChange={(e) => handleSettingChange('theme', e.target.value)}
          label="Theme"
        >
          <MenuItem value="light">☀️ Light</MenuItem>
          <MenuItem value="dark">🌙 Dark</MenuItem>
          <MenuItem value="auto">🌗 Auto (System)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Font Size</InputLabel>
        <Select
          value={settings.fontSize}
          onChange={(e) => handleSettingChange('fontSize', e.target.value)}
          label="Font Size"
        >
          <MenuItem value="small">Small</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="large">Large</MenuItem>
          <MenuItem value="extra-large">Extra Large</MenuItem>
        </Select>
      </FormControl>

      <List>
        <ListItem>
          <ListItemText 
            primary="Message Animations"
            secondary="Animate message appearance and interactions"
          />
          <Switch
            checked={settings.messageAnimations}
            onChange={(e) => handleSettingChange('messageAnimations', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Compact Mode"
            secondary="Reduce spacing and show more messages"
          />
          <Switch
            checked={settings.compactMode}
            onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
          />
        </ListItem>
      </List>
    </Box>
  );

  const renderChatSettings = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Chat Settings
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <KeyboardIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Enter to Send"
            secondary="Press Enter to send message (Shift+Enter for new line)"
          />
          <Switch
            checked={settings.enterToSend}
            onChange={(e) => handleSettingChange('enterToSend', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Typing Indicators"
            secondary="Show when others are typing"
          />
          <Switch
            checked={settings.typingIndicators}
            onChange={(e) => handleSettingChange('typingIndicators', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Read Receipts"
            secondary="Show when your messages are read"
          />
          <Switch
            checked={settings.readReceipts}
            onChange={(e) => handleSettingChange('readReceipts', e.target.checked)}
          />
        </ListItem>
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Message History Limit: {settings.messageHistory} messages
        </Typography>
        <Slider
          value={settings.messageHistory}
          onChange={(_, value) => handleSettingChange('messageHistory', value)}
          min={100}
          max={5000}
          step={100}
          sx={{ color: '#25d366' }}
        />
      </Box>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel>Auto-download Media</InputLabel>
        <Select
          value={settings.autoDownload}
          onChange={(e) => handleSettingChange('autoDownload', e.target.value)}
          label="Auto-download Media"
        >
          <MenuItem value="never">Never</MenuItem>
          <MenuItem value="wifi">Wi-Fi Only</MenuItem>
          <MenuItem value="always">Wi-Fi + Cellular</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderPrivacySettings = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Privacy Settings
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Last Seen</InputLabel>
        <Select
          value={settings.lastSeenVisibility}
          onChange={(e) => handleSettingChange('lastSeenVisibility', e.target.value)}
          label="Last Seen"
        >
          <MenuItem value="everyone">Everyone</MenuItem>
          <MenuItem value="contacts">My Contacts</MenuItem>
          <MenuItem value="nobody">Nobody</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Profile Photo</InputLabel>
        <Select
          value={settings.profilePhotoVisibility}
          onChange={(e) => handleSettingChange('profilePhotoVisibility', e.target.value)}
          label="Profile Photo"
        >
          <MenuItem value="everyone">Everyone</MenuItem>
          <MenuItem value="contacts">My Contacts</MenuItem>
          <MenuItem value="nobody">Nobody</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Who Can Add Me to Groups</InputLabel>
        <Select
          value={settings.whoCanAddMe}
          onChange={(e) => handleSettingChange('whoCanAddMe', e.target.value)}
          label="Who Can Add Me to Groups"
        >
          <MenuItem value="everyone">Everyone</MenuItem>
          <MenuItem value="contacts">My Contacts</MenuItem>
          <MenuItem value="admin-approval">Admin Approval Required</MenuItem>
        </Select>
      </FormControl>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Privacy settings help you control who can see your information and contact you.
        </Typography>
      </Alert>
    </Box>
  );

  const renderAboutSettings = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        About ChatConnect
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <img 
          src="/chat-icon.svg" 
          alt="ChatConnect" 
          style={{ width: 64, height: 64, marginBottom: 16 }}
        />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          ChatConnect
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Version 1.0.0
        </Typography>
        <Chip 
          label="Real-time Messaging" 
          size="small" 
          sx={{ bgcolor: '#25d366', color: 'white', mt: 1 }}
        />
      </Paper>

      <List>
        <ListItem>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Features"
            secondary="Real-time messaging, multiple rooms, emoji support, typing indicators"
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Storage Used"
            secondary="~2.5 MB of local storage"
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Built With"
            secondary="React, TypeScript, Material-UI, Socket.IO"
          />
        </ListItem>
      </List>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={() => window.open('https://github.com', '_blank')}
          sx={{ mr: 2 }}
        >
          GitHub
        </Button>
        <Button 
          variant="outlined"
          onClick={() => window.open('mailto:support@chatconnect.com')}
        >
          Support
        </Button>
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'chat': return renderChatSettings();
      case 'privacy': return renderPrivacySettings();
      case 'about': return renderAboutSettings();
      default: return renderProfileSettings();
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
              height: '80vh',
              borderRadius: 3
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

        <DialogContent sx={{ p: 0, display: 'flex', height: '100%' }}>
          {/* Sidebar */}
          <Box sx={{ 
            width: 280, 
            borderRight: '1px solid #e0e0e0',
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
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderContent()}
            
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
    </>
  );
}