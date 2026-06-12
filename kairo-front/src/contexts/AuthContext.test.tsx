import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthContext';
import * as secureStore from '@/src/lib/secureStore';
import * as api from '@/src/lib/api';
import { router } from 'expo-router';

// Cast functions to Jest mocks for control within tests
const apiFetchMock = api.apiFetch as jest.Mock;
const loginRequestMock = api.loginRequest as jest.Mock;
const logoutRequestMock = api.logoutRequest as jest.Mock;

const TestComponent = () => {
  const { user, token, loading, login, logout } = useAuth();
  return (
    <View>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
      <Text testID="token">{token ?? 'none'}</Text>
      <Text testID="username">{user?.username ?? 'none'}</Text>
      <TouchableOpacity testID="login-btn" onPress={() => login('test@example.com', 'password')} />
      <TouchableOpacity testID="logout-btn" onPress={logout} />
    </View>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if no auth token is found initially', async () => {
    // Mock secure store returning null token
    jest.spyOn(secureStore, 'getItemAsync').mockImplementation(async (key) => {
      if (key === 'authToken') return null;
      return null;
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('token').props.children).toBe('none');
    expect(getByTestId('username').props.children).toBe('none');
    expect(router.replace).toHaveBeenCalledWith('/login');
  });

  it('loads profile and redirects to home if token is found initially', async () => {
    // Mock secure store returning auth token
    jest.spyOn(secureStore, 'getItemAsync').mockImplementation(async (key) => {
      if (key === 'authToken') return 'valid-token';
      if (key === 'onboardingCompleted') return 'true';
      return null;
    });

    // Mock API returning profile data
    apiFetchMock.mockResolvedValueOnce({
      data: {
        id: 42,
        email: 'test@example.com',
        info: { name: 'John Doe', avatar_url: null, coins: 15, largest_streak: 3 },
      },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(getByTestId('token').props.children).toBe('valid-token');
    expect(getByTestId('username').props.children).toBe('John Doe');
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });

  it('performs login successfully, saves token, fetches profile, and redirects to home', async () => {
    // Mock initial check returning null
    jest.spyOn(secureStore, 'getItemAsync').mockImplementation(async (key) => {
      if (key === 'authToken') return null;
      if (key === 'onboardingCompleted') return 'false';
      return null;
    });

    const setItemSpy = jest.spyOn(secureStore, 'setItemAsync').mockResolvedValue(undefined as any);

    // Mock login endpoint
    loginRequestMock.mockResolvedValueOnce({
      token: 'new-auth-token-999',
    });

    // Mock profile fetch endpoint
    apiFetchMock.mockResolvedValueOnce({
      data: {
        id: 99,
        email: 'new@example.com',
        info: { name: 'New User', avatar_url: null, coins: 0, largest_streak: 0 },
      },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load redirection to complete
    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    // Reset router calls to check login-specific routing
    (router.replace as jest.Mock).mockClear();

    // Trigger Login press
    const loginBtn = getByTestId('login-btn');
    fireEvent.press(loginBtn);

    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    expect(loginRequestMock).toHaveBeenCalledWith('test@example.com', 'password', 'mobile');
    expect(setItemSpy).toHaveBeenCalledWith('authToken', 'new-auth-token-999');
    expect(getByTestId('token').props.children).toBe('new-auth-token-999');
    expect(getByTestId('username').props.children).toBe('New User');
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });

  it('performs logout successfully, deletes token, and redirects to login', async () => {
    // Mock initial check starting with token already in place
    jest.spyOn(secureStore, 'getItemAsync').mockImplementation(async (key) => {
      if (key === 'authToken') return 'old-token';
      return null;
    });

    const deleteItemSpy = jest.spyOn(secureStore, 'deleteItemAsync').mockResolvedValue(undefined as any);

    // Mock profile fetch
    apiFetchMock.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'test@example.com',
        info: null,
      },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(getByTestId('loading').props.children).toBe('false');
    });

    (router.replace as jest.Mock).mockClear();

    // Trigger Logout press
    const logoutBtn = getByTestId('logout-btn');
    fireEvent.press(logoutBtn);

    await waitFor(() => {
      expect(getByTestId('token').props.children).toBe('none');
    });

    expect(logoutRequestMock).toHaveBeenCalled();
    expect(deleteItemSpy).toHaveBeenCalledWith('authToken');
    expect(getByTestId('username').props.children).toBe('none');
    expect(router.replace).toHaveBeenCalledWith('/login');
  });
});

