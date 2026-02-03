// Theme types
export type Theme = 'dark' | 'light';

// Background theme types
export type BackgroundTheme = 'particles' | 'space' | 'fluid';

export interface BackgroundContextType {
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
}

// Social link types
export interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType;
}

// Sound hook return type
export interface UseSoundReturn {
  playHover: () => void;
  playClick: () => void;
  playToggle: (isDark: boolean) => void;
  playSuccess: () => void;
}
