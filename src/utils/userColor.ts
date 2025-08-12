// src/utils/userColor.ts

/**
 * Color palettes optimized for different themes and accessibility
 */
const COLOR_PALETTES = {
  // High contrast colors for better readability
  default: [
    "#1976d2", // Blue
    "#388e3c", // Green  
    "#f57c00", // Orange
    "#7b1fa2", // Purple
    "#c2185b", // Pink
    "#00796b", // Teal
    "#5d4037", // Brown
    "#455a64", // Blue Grey
    "#e64a19", // Deep Orange
    "#303f9f", // Indigo
    "#689f38", // Light Green
    "#fbc02d", // Yellow
    "#512da8", // Deep Purple
    "#0288d1", // Light Blue
    "#d32f2f", // Red
    "#f57f17", // Lime
  ],
  
  // Softer colors for light themes
  light: [
    "#42a5f5", "#66bb6a", "#ff7043", "#ab47bc", "#ec407a",
    "#26a69a", "#8d6e63", "#78909c", "#ffa726", "#5c6bc0",
    "#9ccc65", "#ffca28", "#7e57c2", "#29b6f6", "#ef5350",
    "#d4e157"
  ],
  
  // Darker colors for dark themes  
  dark: [
    "#1565c0", "#2e7d32", "#ef6c00", "#6a1b9a", "#ad1457",
    "#00695c", "#4e342e", "#37474f", "#e65100", "#283593",
    "#558b2f", "#f9a825", "#4527a0", "#0277bd", "#c62828",
    "#827717"
  ]
};

/**
 * Cache for storing computed colors to improve performance
 */
const colorCache = new Map<string, string>();

/**
 * Improved hash function for better distribution
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Returns a consistent color for each username with improved algorithm
 * @param username - The username to generate color for
 * @param theme - Color theme to use ('default' | 'light' | 'dark')
 * @param excludeColors - Array of colors to exclude from selection
 * @returns Hex color string
 */
export function getUserColor(
  username: string, 
  theme: 'default' | 'light' | 'dark' = 'default',
  excludeColors: string[] = []
): string {
  // Handle edge cases
  if (!username || username.trim().length === 0) {
    return COLOR_PALETTES[theme][0];
  }

  // Create cache key
  const cacheKey = `${username}-${theme}-${excludeColors.join(',')}`;
  
  // Check cache first
  if (colorCache.has(cacheKey)) {
    return colorCache.get(cacheKey)!;
  }

  // Get color palette and filter excluded colors
  let colors = COLOR_PALETTES[theme].filter(color => 
    !excludeColors.includes(color)
  );
  
  // Fallback to default if all colors excluded
  if (colors.length === 0) {
    colors = COLOR_PALETTES[theme];
  }

  // Generate hash and select color
  const hash = djb2Hash(username.toLowerCase().trim());
  const selectedColor = colors[hash % colors.length];
  
  // Cache the result
  colorCache.set(cacheKey, selectedColor);
  
  return selectedColor;
}

/**
 * Get multiple colors for a list of usernames, ensuring uniqueness when possible
 */
export function getMultipleUserColors(
  usernames: string[], 
  theme: 'default' | 'light' | 'dark' = 'default'
): Record<string, string> {
  const result: Record<string, string> = {};
  const usedColors = new Set<string>();
  
  // First pass: assign colors avoiding duplicates
  for (const username of usernames) {
    const availableColors = COLOR_PALETTES[theme].filter(color => 
      !usedColors.has(color)
    );
    
    if (availableColors.length > 0) {
      const hash = djb2Hash(username.toLowerCase().trim());
      const selectedColor = availableColors[hash % availableColors.length];
      result[username] = selectedColor;
      usedColors.add(selectedColor);
    } else {
      // If all colors used, just use regular function
      result[username] = getUserColor(username, theme);
    }
  }
  
  return result;
}

/**
 * Get a contrasting text color (black or white) for a given background color
 * Fixed: Replaced deprecated substr with slice
 */
export function getContrastTextColor(backgroundColor: string): string {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate brightness using relative luminance formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  return brightness > 128 ? '#000000' : '#ffffff';
}

/**
 * Clear the color cache (useful for testing or memory management)
 */
export function clearColorCache(): void {
  colorCache.clear();
}

/**
 * Get cache statistics
 */
export function getColorCacheStats() {
  return {
    size: colorCache.size,
    keys: Array.from(colorCache.keys())
  };
}