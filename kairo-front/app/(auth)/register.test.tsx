import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from './register';
import { TamaguiProvider } from '@tamagui/core';
import { config } from '@/tamagui.config';
import * as api from '@/src/lib/api';
import { router } from 'expo-router';

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

const registerRequestMock = api.registerRequest as jest.Mock;

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <TamaguiProvider config={config}>
      {ui}
    </TamaguiProvider>
  );
};

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields and submit button', () => {
    const { getByPlaceholderText, getByText, getAllByText } = renderWithTheme(<RegisterScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getAllByText('Register').length).toBe(2);
    expect(getByText('Already have an account? Log in')).toBeTruthy();
  });

  it('performs registration successfully and redirects to login with email parameter', async () => {
    registerRequestMock.mockResolvedValueOnce({
      success: true,
    });

    const { getByPlaceholderText, getByText, getAllByText } = renderWithTheme(<RegisterScreen />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getAllByText('Register')[1];

    fireEvent.changeText(emailInput, 'newuser@example.com');
    fireEvent.changeText(passwordInput, 'newpassword123');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(registerRequestMock).toHaveBeenCalledWith('newuser@example.com', 'newpassword123', 'mobile');
    });

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith(
        expect.stringContaining('/login?email=newuser%40example.com')
      );
    });
  });

  it('shows error message when registration fails', async () => {
    registerRequestMock.mockRejectedValueOnce(new Error('Email already registered'));

    const { getByPlaceholderText, getByText, getAllByText, queryByText } = renderWithTheme(<RegisterScreen />);

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitBtn = getAllByText('Register')[1];

    fireEvent.changeText(emailInput, 'existing@example.com');
    fireEvent.changeText(passwordInput, 'pass123');
    fireEvent.press(submitBtn);

    await waitFor(() => {
      expect(queryByText('Email already registered')).toBeTruthy();
    });
  });
});
