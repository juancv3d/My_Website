// Theme types
export type Theme = 'dark' | 'light';

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
