// src/components/settings/NotificationSettings.tsx
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Switch, Slider } from "@mui/material";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSettings } from "../../hooks/useSettings";

export default function NotificationSettings() {
  const { settings, updateSetting } = useSettings();

  return (
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
            onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
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
            onChange={(e) => {
              updateSetting('desktopNotifications', e.target.checked);
              if (e.target.checked && Notification.permission !== 'granted') {
                Notification.requestPermission();
              }
            }}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Message Preview"
            secondary="Show message content in notifications"
          />
          <Switch
            checked={settings.messagePreview}
            onChange={(e) => updateSetting('messagePreview', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Mute During Calls"
            secondary="Disable notifications during voice/video calls"
          />
          <Switch
            checked={settings.muteDuringCalls}
            onChange={(e) => updateSetting('muteDuringCalls', e.target.checked)}
          />
        </ListItem>
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Notification Volume: {settings.notificationVolume}%
        </Typography>
        <Slider
          value={settings.notificationVolume}
          onChange={(_, value) => {
            const next = Array.isArray(value) ? value[0] : value;
            updateSetting('notificationVolume', next);
          }}
          min={0}
          max={100}
          sx={{ color: '#25d366' }}
        />
      </Box>
    </Box>
  );
}