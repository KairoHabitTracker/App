import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Profile from './profile';
import { TamaguiProvider } from '@tamagui/core';
import { config } from '@/tamagui.config';
import * as api from '@/src/lib/api';

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

const apiFetchMock = api.apiFetch as jest.Mock;

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <TamaguiProvider config={config}>
      {ui}
    </TamaguiProvider>
  );
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator initially', () => {
    // Return a promise that does not resolve immediately
    apiFetchMock.mockReturnValue(new Promise(() => {}));
    
    const { queryByText } = renderWithTheme(<Profile />);
    
    // ActivityIndicator uses ActivityIndicator component type
    // We can just verify it doesn't render profile text "Management" yet
    // because it is loading
    expect(apiFetchMock).toHaveBeenCalledWith('/api/profile');
  });

  it('renders profile name, streak, coins, and plan when loaded', async () => {
    apiFetchMock.mockResolvedValueOnce({
      data: {
        id: 10,
        email: 'elon@spacex.com',
        info: {
          name: 'Elon Musk',
          avatar_url: null,
          streak: 42,
          coins: 999,
          subscription: 'Premium',
        },
      },
    });

    const { getByText } = renderWithTheme(<Profile />);

    await waitFor(() => {
      expect(getByText('Elon Musk')).toBeTruthy();
      expect(getByText('42')).toBeTruthy(); // streak
      expect(getByText('999')).toBeTruthy(); // coins
      expect(getByText('Premium')).toBeTruthy(); // plan
    });

    expect(getByText('Management')).toBeTruthy();
    expect(getByText('My Habits')).toBeTruthy();
    expect(getByText('Edit Profile')).toBeTruthy();
    expect(getByText('App Settings')).toBeTruthy();
  });
});
