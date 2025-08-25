import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type FontSize = 'small' | 'medium' | 'large';
export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'disabled';

interface ThemeSettings {
  mode: ThemeMode;
  fontSize: FontSize;
  animationSpeed: AnimationSpeed;
  compactMode: boolean;
  highContrast: boolean;
  borderRadius: number;
}

interface ThemeContextType {
  settings: ThemeSettings;
  isDark: boolean;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

const defaultSettings: ThemeSettings = {
  mode: 'light',
  fontSize: 'medium',
  animationSpeed: 'normal',
  compactMode: false,
  highContrast: false,
  borderRadius: 8,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [isDark, setIsDark] = useState(false);

  // Detect system dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateDarkMode = () => {
      if (settings.mode === 'auto') {
        setIsDark(mediaQuery.matches);
      } else {
        setIsDark(settings.mode === 'dark');
      }
    };

    updateDarkMode();
    mediaQuery.addEventListener('change', updateDarkMode);

    return () => mediaQuery.removeEventListener('change', updateDarkMode);
  }, [settings.mode]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('theme-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply CSS variables for theme
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    const fontSizes = {
      small: '12px',
      medium: '14px',
      large: '16px'
    };
    root.style.setProperty('--app-font-size', fontSizes[settings.fontSize]);

    // Animation duration
    const animationSpeeds = {
      slow: '0.6s',
      normal: '0.3s',
      fast: '0.15s',
      disabled: '0s'
    };
    root.style.setProperty('--animation-duration', animationSpeeds[settings.animationSpeed]);

    // Border radius
    root.style.setProperty('--border-radius', `${settings.borderRadius}px`);

    // Compact mode
    root.style.setProperty('--spacing-unit', settings.compactMode ? '8px' : '16px');

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [settings]);

  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetTheme = () => {
    setSettings(defaultSettings);
  };

  const value: ThemeContextType = {
    settings,
    isDark,
    updateTheme,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 