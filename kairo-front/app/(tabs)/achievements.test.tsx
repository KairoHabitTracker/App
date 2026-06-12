import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AchievementsScreen from './achievements';
import { TamaguiProvider } from '@tamagui/core';
import { config } from '@/tamagui.config';
import { useAchievements } from '@/src/hooks/useAchievements';

// Mock ThemeContext to return static values and a dummy provider to avoid AsyncStorage async hydration warnings in tests
jest.mock('@/src/contexts/ThemeContext', () => {
  const dummyColors = {
    background: '#F8F9FB',
    card: '#FFFFFF',
    surface: '#F3F4F6',
    text: '#111827',
    subtleText: '#6B7280',
    border: '#E5E7EB',
    accent: '#3B82F6',
    mutedAccent: '#d3dcfc',
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
  return {
    ThemeProvider: ({ children }: any) => children,
    useThemeMode: () => ({
      colorScheme: 'light',
      colors: dummyColors,
      isDarkMode: false,
      loading: false,
      toggleTheme: jest.fn(),
      setTheme: jest.fn(),
    }),
  };
});

const useAchievementsMock = useAchievements as jest.Mock;

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <TamaguiProvider config={config}>
      {ui}
    </TamaguiProvider>
  );
};

describe('AchievementsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when loading is true and no data', () => {
    useAchievementsMock.mockReturnValue({
      achievements: [],
      loading: true,
      error: null,
      refresh: jest.fn(),
      total: 0,
      unlockedCount: 0,
      pointsEarned: 0,
    });

    const { queryByText } = renderWithTheme(<AchievementsScreen />);
    
    expect(queryByText('No achievements yet')).toBeNull();
  });

  it('renders error message when achievements hook returns error', () => {
    useAchievementsMock.mockReturnValue({
      achievements: [],
      loading: false,
      error: 'Failed to fetch badges',
      refresh: jest.fn(),
      total: 0,
      unlockedCount: 0,
      pointsEarned: 0,
    });

    const { getByText } = renderWithTheme(<AchievementsScreen />);

    expect(getByText('Could not load achievements')).toBeTruthy();
    expect(getByText('Failed to fetch badges')).toBeTruthy();
  });

  it('renders consistency consistency card, stats, and unlocked/locked badges', () => {
    useAchievementsMock.mockReturnValue({
      achievements: [
        {
          id: 1,
          unlocked_at: '2026-06-10T12:00:00Z',
          achievement: {
            identifier: 'first_habit',
            description: 'Completed your very first habit!',
          },
        },
        {
          id: 2,
          unlocked_at: null, // locked
          achievement: {
            identifier: 'habit_streak_7',
            description: 'Complete habits 7 days in a row',
          },
        },
      ],
      loading: false,
      error: null,
      refresh: jest.fn(),
      total: 10,
      unlockedCount: 1,
      pointsEarned: 50,
    });

    const { getByText, queryByText } = renderWithTheme(<AchievementsScreen />);

    // Verify stats
    expect(getByText('Consistency Pays Off')).toBeTruthy();
    expect(getByText('1 / 10')).toBeTruthy(); // Unlocked stats ratio
    expect(getByText('50')).toBeTruthy(); // Points

    // Verify first_habit (unlocked)
    expect(getByText('First Habit Complete')).toBeTruthy();
    expect(getByText('Completed your very first habit!')).toBeTruthy();
    expect(getByText('Unlocked on 6/10/2026')).toBeTruthy();

    // Verify habit_streak_7 (locked)
    expect(getByText('7-Day Streak')).toBeTruthy();
    expect(getByText('Complete habits 7 days in a row')).toBeTruthy();
    expect(getByText('Keep going to unlock this badge.')).toBeTruthy();
  });
});
