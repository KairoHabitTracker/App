import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from './login';
import { renderWithProviders } from '@/src/test/test-utils';
import * as api from '@/src/lib/api';
import * as secureStore from '@/src/lib/secureStore';
import { router } from 'expo-router';

const loginRequestMock = api.loginRequest as jest.Mock;
const apiFetchMock = api.apiFetch as jest.Mock;

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

// Mock HabitsContext to return a dummy provider and hook values to avoid async habit fetching side-effects during login tests
jest.mock('@/src/contexts/HabitsContext', () => ({
  HabitsProvider: ({ children }: any) => children,
  useHabits: () => ({
    habits: [],
    userHabits: [],
    loading: false,
    error: null,
    fetchUserHabits: jest.fn(),
    fetchHabitsCatalog: jest.fn(),
    addUserHabit: jest.fn(),
    completeHabit: jest.fn(),
    uncompleteHabit: jest.fn(),
    deleteUserHabit: jest.fn(),
    updateUserHabitReminders: jest.fn(),
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    jest.spyOn(secureStore, 'getItemAsync').mockImplementation(async (key) => {
      if (key === 'authToken') return null;
      if (key === 'onboardingCompleted') return 'false';
      return null;
    });

    // Mock API profile fetch (triggered on mount if token, or after login success)
    apiFetchMock.mockResolvedValue({
      data: {
        id: 1,
        email: 'test@example.com',
        info: { name: 'Test User', coins: 10, largest_streak: 2 },
      },
    });
  });

  it('renders input fields and submit button', async () => {
    const { getByPlaceholderText, getByText, getAllByText } = renderWithProviders(<LoginScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getAllByText('Log in').length).toBe(2);
    expect(getByText("Don't have an account? Register")).toBeTruthy();

    // Wait for initial load redirect to settle to prevent act warnings
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/login');
    });
  });

  it('performs login successfully and redirects to home page', async () => {
    loginRequestMock.mockResolvedValueOnce({
      token: 'success-token-xyz',
    });

    const { getByPlaceholderText, getByText, getAllByText } = renderWithProviders(<LoginScreen />);

    // Wait for initial load redirect to settle
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/login');
    });
    (router.replace as jest.Mock).mockClear();

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getAllByText('Log in')[1];

    fireEvent.changeText(emailInput, 'user@example.com');
    fireEvent.changeText(passwordInput, 'mysecretpassword');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(loginRequestMock).toHaveBeenCalledWith('user@example.com', 'mysecretpassword', 'mobile');
    });

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
    });
  });

  it('shows error message when login api fails', async () => {
    loginRequestMock.mockRejectedValueOnce(new Error('Invalid email or password'));

    const { getByPlaceholderText, getByText, getAllByText, queryByText } = renderWithProviders(<LoginScreen />);

    // Wait for initial load redirect to settle
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/login');
    });

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getAllByText('Log in')[1];

    fireEvent.changeText(emailInput, 'wrong@example.com');
    fireEvent.changeText(passwordInput, 'wrongpass');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(queryByText('Invalid email or password')).toBeTruthy();
    });
  });
});
