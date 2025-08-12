// src/components/settings/PrivacySettings.tsx
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import { useSettings } from "../../hooks/useSettings";

export default function PrivacySettings() {
  const { settings, updateSetting } = useSettings();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Privacy Settings
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Last Seen</InputLabel>
        <Select
          value={settings.lastSeenVisibility}
          onChange={(e) => updateSetting('lastSeenVisibility', e.target.value)}
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
          onChange={(e) => updateSetting('profilePhotoVisibility', e.target.value)}
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
          onChange={(e) => updateSetting('whoCanAddMe', e.target.value)}
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
}