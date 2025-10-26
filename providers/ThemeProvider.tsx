import React, { createContext, useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Colors, getCustomColors } from '../constants/Colors';
import { useAppSelector } from '../store/hooks';

interface ThemeContextType {
  colors: typeof Colors.light;
  themeMode: 'light' | 'dark' | 'custom';
  customAccentColor: string;
  isAnimating: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, customAccentColor, isAnimating } = useAppSelector((state) => state.theme);
  const [colors, setColors] = useState(Colors.light);

  useEffect(() => {
    try {
      let newColors;
      switch (mode) {
        case 'dark':
          newColors = Colors.dark;
          break;
        case 'custom':
          newColors = getCustomColors(customAccentColor);
          break;
        default:
          newColors = Colors.light;
      }
      setColors(newColors);
    } catch (error) {
      console.error('Error getting colors:', error);
      setColors(Colors.light);
    }
  }, [mode, customAccentColor]);

  const contextValue: ThemeContextType = {
    colors,
    themeMode: mode,
    customAccentColor,
    isAnimating,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
