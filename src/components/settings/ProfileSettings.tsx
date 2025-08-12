// src/components/settings/ProfileSettings.tsx
import { Box, Typography, Avatar, Button, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getUserColor } from "../../utils/userColor";
import { useSettings } from "../../hooks/useSettings";

export default function ProfileSettings() {
  const { settings, updateSetting } = useSettings();

  return (
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
        onChange={(e) => updateSetting('username', e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        helperText="This is how others will see you in chat"
      />

      {/* Status */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={settings.status}
          onChange={(e) => updateSetting('status', e.target.value)}
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
}