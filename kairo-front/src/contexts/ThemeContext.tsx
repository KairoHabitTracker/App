import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {Appearance, Platform, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'themePreference';

type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  card: string;
  surface: string;
  text: string;
  subtleText: string;
  border: string;
  accent: string;
  mutedAccent: string;
  warning: string;
  warningBackground: string;
  chipBackground: string;
  chipBorder: string;
  chipText: string;
  danger: string;
  dangerBackground: string;
  success: string;
  successBackground: string;
};

const lightColors: ThemeColors = {
  background: '#F8F9FB',
  card: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#111827',
  subtleText: '#6B7280',
  border: '#E5E7EB',
  accent: '#3B82F6',
  mutedAccent: '#E0E7FF',
  warning: '#F97316',
  warningBackground: '#FFF7ED',
  chipBackground: '#F3F4F6',
  chipBorder: '#E5E7EB',
  chipText: '#374151',
  danger: '#DC2626',
  dangerBackground: '#FEE2E2',
  success: '#059669',
  successBackground: '#ECFDF5',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  card: '#1E293B',
  surface: '#273449',
  text: '#F8FAFC',
  subtleText: '#94A3B8',
  border: '#1F2937',
  accent: '#60A5FA',
  mutedAccent: '#1D4ED8',
  warning: '#FDBA74',
  warningBackground: '#4A1D09',
  chipBackground: '#334155',
  chipBorder: '#475569',
  chipText: '#E2E8F0',
  danger: '#F87171',
  dangerBackground: '#4C0519',
  success: '#34D399',
  successBackground: '#052E16',
};

type ThemeContextValue = {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDarkMode: boolean;
  loading: boolean;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({children}: { children: ReactNode }) {
  const preferredScheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredScheme);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!isMounted) return;
        if (value === 'light' || value === 'dark') {
          setColorScheme(value);
        } else {
          setColorScheme(preferredScheme);
        }
      })
      .finally(() => {
        if (isMounted) {
          setHydrated(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [preferredScheme]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, colorScheme).catch((error) => {
      console.warn('Failed to persist theme preference', error);
    });
  }, [colorScheme, hydrated]);

  const setTheme = useCallback((scheme: ColorScheme) => {
    setColorScheme(scheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.background);
    }
  }, [colorScheme, colors.background]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      colors,
      isDarkMode: colorScheme === 'dark',
      loading: !hydrated,
      toggleTheme,
      setTheme,
    }),
    [colorScheme, colors, hydrated, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeProvider');
  }
  return context;
}
