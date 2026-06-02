import { createContext, useContext, useState } from 'react';
import { LightTheme, DarkTheme, AppTheme } from '@/constants/themes';

interface ThemeContextValue {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  theme: AppTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider');
  return ctx;
}
