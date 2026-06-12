import React from 'react';
import { Switch } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import NotificationsScreen from './notifications';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { TamaguiProvider } from '@tamagui/core';
import { config } from '@/tamagui.config';
import { useLocalNotifications } from '@/src/hooks/useLocalNotifications';
import { useHabits } from '@/src/contexts/HabitsContext';

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

jest.mock('@/src/contexts/HabitsContext', () => ({
  useHabits: jest.fn(),
}));

jest.mock('@/src/hooks/useLocalNotifications', () => ({
  useLocalNotifications: jest.fn(),
}));

const useHabitsMock = useHabits as jest.Mock;
const useLocalNotificationsMock = useLocalNotifications as jest.Mock;

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <TamaguiProvider config={config}>
      {ui}
    </TamaguiProvider>
  );
};

describe('NotificationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for useLocalNotifications
    useLocalNotificationsMock.mockReturnValue({
      scheduleHabitReminders: jest.fn(async () => true),
      cancelAllNotifications: jest.fn(async () => {}),
      permissionsGranted: true,
    });
  });

  it('renders settings rows and active notifications correctly', async () => {
    useHabitsMock.mockReturnValue({
      userHabits: [
        {
          id: 1,
          notification_time: '08:30',
          days_of_week: ['monday', 'wednesday'],
          habit: { name: 'Read Book', emoji: '📚', hex_color: '#8B5CF6' }
        },
        {
          id: 2,
          notification_time: null,
          days_of_week: [],
          habit: { name: 'Gym', emoji: '🏋️', hex_color: '#EF4444' }
        }
      ],
    });

    const { getByText, queryByText } = renderWithTheme(<NotificationsScreen />);

    expect(getByText('General Settings')).toBeTruthy();
    expect(getByText('Habit Reminders')).toBeTruthy();
    expect(getByText('Sound')).toBeTruthy();

    // Verify it renders active notifications section
    expect(getByText('Active notifications (1)')).toBeTruthy();
    expect(getByText('Read Book')).toBeTruthy();
    expect(getByText('08:30')).toBeTruthy();
    expect(getByText('Mon, Wed')).toBeTruthy(); // formatted days

    // Verify inactive habit Gym is NOT in the list
    expect(queryByText('Gym')).toBeNull();
  });

  it('shows empty state when no active notifications are set', () => {
    useHabitsMock.mockReturnValue({
      userHabits: [],
    });

    const { getByText } = renderWithTheme(<NotificationsScreen />);

    expect(getByText("You don't have any active notifications yet.")).toBeTruthy();
  });

  it('triggers scheduleHabitReminders and cancelAllNotifications on reminder switch toggle', async () => {
    const scheduleMock = jest.fn().mockResolvedValue(true);
    const cancelMock = jest.fn().mockResolvedValue(undefined);

    useLocalNotificationsMock.mockReturnValue({
      scheduleHabitReminders: scheduleMock,
      cancelAllNotifications: cancelMock,
      permissionsGranted: true,
    });

    useHabitsMock.mockReturnValue({
      userHabits: [
        {
          id: 1,
          notification_time: '08:30',
          days_of_week: ['monday'],
          habit: { name: 'Read Book', emoji: '📚', hex_color: '#8B5CF6' }
        }
      ],
    });

    const { UNSAFE_getAllByType, getByText } = renderWithTheme(<NotificationsScreen />);

    expect(getByText('Habit Reminders')).toBeTruthy();

    const switches = UNSAFE_getAllByType(Switch);
    const reminderSwitch = switches[0]; // first switch is Habit Reminders

    // Turn switch ON
    fireEvent(reminderSwitch, 'valueChange', true);
    
    await waitFor(() => {
      expect(scheduleMock).toHaveBeenCalled();
    });

    // Turn switch OFF
    fireEvent(reminderSwitch, 'valueChange', false);

    await waitFor(() => {
      expect(cancelMock).toHaveBeenCalled();
    });
  });
});
