// src/components/settings/AppearanceSettings.tsx
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, Switch } from "@mui/material";
import { useSettings } from "../../hooks/useSettings";

export default function AppearanceSettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Appearance Settings
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={settings.theme}
          onChange={(e) => updateSetting('theme', e.target.value)}
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
          onChange={(e) => updateSetting('fontSize', e.target.value)}
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
            onChange={(e) => updateSetting('messageAnimations', e.target.checked)}
          />
        </ListItem>

        <ListItem>
          <ListItemText 
            primary="Compact Mode"
            secondary="Reduce spacing and show more messages"
          />
          <Switch
            checked={settings.compactMode}
            onChange={(e) => updateSetting('compactMode', e.target.checked)}
          />
        </ListItem>
      </List>
    </Box>
  );
}