// src/components/settings/AboutSettings.tsx
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Button, Chip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import LanguageIcon from '@mui/icons-material/Language';

type Props = Readonly<{
  onResetClick: () => void;
}>;

export default function AboutSettings({ onResetClick }: Props) {
  return (
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

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          color="error"
          onClick={onResetClick}
        >
          Reset All Settings
        </Button>
      </Box>
    </Box>
  );
}