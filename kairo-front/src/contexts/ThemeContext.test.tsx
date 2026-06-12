import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useThemeMode } from './ThemeContext';

const TestComponent = () => {
  const { colorScheme, toggleTheme, setTheme, isDarkMode } = useThemeMode();
  return (
    <>
      <Text testID="theme-text">{colorScheme}</Text>
      <Text testID="dark-mode-text">{isDarkMode ? 'true' : 'false'}</Text>
      <TouchableOpacity testID="toggle-btn" onPress={toggleTheme} />
      <TouchableOpacity testID="set-dark-btn" onPress={() => setTheme('dark')} />
    </>
  );
};

describe('ThemeContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with default theme and hydrates from AsyncStorage if present', async () => {
    await AsyncStorage.setItem('themePreference', 'dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Wait for hydration effect to complete
    await waitFor(() => {
      expect(getByTestId('theme-text').props.children).toBe('dark');
    });
    expect(getByTestId('dark-mode-text').props.children).toBe('true');
  });

  it('toggles theme and persists to AsyncStorage', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Default could be light
    await waitFor(() => {
      expect(getByTestId('theme-text').props.children).toBe('light');
    });

    const toggleBtn = getByTestId('toggle-btn');
    fireEvent.press(toggleBtn);

    await waitFor(() => {
      expect(getByTestId('theme-text').props.children).toBe('dark');
    });

    const storedTheme = await AsyncStorage.getItem('themePreference');
    expect(storedTheme).toBe('dark');
  });

  it('sets theme explicitly', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-text').props.children).toBe('light');
    });

    const setDarkBtn = getByTestId('set-dark-btn');
    fireEvent.press(setDarkBtn);

    await waitFor(() => {
      expect(getByTestId('theme-text').props.children).toBe('dark');
    });
  });
});
