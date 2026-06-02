import { AppTheme } from '@/constants/themes';
import { useThemeContext } from '@/contexts/ThemeContext';

export const useTheme = (): AppTheme => useThemeContext().theme;
