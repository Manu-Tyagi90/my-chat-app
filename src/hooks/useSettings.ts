// src/hooks/useSettings.ts
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

// Define settings type for type safety
export type UserSettings = {
  // Profile settings
  username: string;
  status: 'Available' | 'Busy' | 'Away' | 'Invisible';
  
  // Notification settings
  soundEnabled: boolean;
  desktopNotifications: boolean;
  messagePreview: boolean;
  muteDuringCalls: boolean;
  notificationVolume: number;
  
  // Appearance settings
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  messageAnimations: boolean;
  compactMode: boolean;
  
  // Chat settings
  enterToSend: boolean;
  typingIndicators: boolean;
  readReceipts: boolean;
  messageHistory: number;
  autoDownload: 'never' | 'wifi' | 'always';
  
  // Privacy settings
  lastSeenVisibility: 'everyone' | 'contacts' | 'nobody';
  profilePhotoVisibility: 'everyone' | 'contacts' | 'nobody';
  whoCanAddMe: 'everyone' | 'contacts' | 'admin-approval';
};

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  username: '',
  status: 'Available',
  soundEnabled: true,
  desktopNotifications: true,
  messagePreview: true,
  muteDuringCalls: false,
  notificationVolume: 70,
  theme: 'light',
  fontSize: 'medium',
  messageAnimations: true,
  compactMode: false,
  enterToSend: true,
  typingIndicators: true,
  readReceipts: true,
  messageHistory: 1000,
  autoDownload: 'wifi',
  lastSeenVisibility: 'everyone',
  profilePhotoVisibility: 'everyone',
  whoCanAddMe: 'everyone',
};

export const useSettings = () => {
  const { user } = useUser();
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Load settings from localStorage on init
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Initialize username from user context
  useEffect(() => {
    if (user?.username && !settings.username) {
      updateSetting('username', user.username);
    }
  }, [user?.username, settings.username]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
  }, [settings]);

  // Update a single setting
  const updateSetting = <K extends keyof UserSettings>(
    key: K, 
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('chatSettings');
  };

  return {
    settings,
    updateSetting,
    setSettings,
    resetSettings
  };
};