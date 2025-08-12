// src/components/settings/ChatSettings.tsx
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Switch, Slider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useSettings } from "../../hooks/useSettings";

export default function ChatSettings() {
  const { settings, updateSetting } = useSettings();

  return (
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
            onChange={(e) => updateSetting('enterToSend', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Typing Indicators"
            secondary="Show when others are typing"
          />
          <Switch
            checked={settings.typingIndicators}
            onChange={(e) => updateSetting('typingIndicators', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Read Receipts"
            secondary="Show when your messages are read"
          />
          <Switch
            checked={settings.readReceipts}
            onChange={(e) => updateSetting('readReceipts', e.target.checked)}
          />
        </ListItem>
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" gutterBottom>
          Message History Limit: {settings.messageHistory} messages
        </Typography>
        <Slider
          value={settings.messageHistory}
          onChange={(_, value) => updateSetting('messageHistory', value)}
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
          onChange={(e) => updateSetting('autoDownload', e.target.value)}
          label="Auto-download Media"
        >
          <MenuItem value="never">Never</MenuItem>
          <MenuItem value="wifi">Wi-Fi Only</MenuItem>
          <MenuItem value="always">Wi-Fi + Cellular</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}