import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from '@tamagui/core';
import { config } from '@/tamagui.config';

import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { HabitsProvider } from '@/src/contexts/HabitsContext';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TamaguiProvider config={config}>
          <AuthProvider>
            <HabitsProvider>{children}</HabitsProvider>
          </AuthProvider>
        </TamaguiProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Custom render function that wraps components with all necessary providers
 * Use this when testing components that depend on context (AuthContext, ThemeContext, HabitsContext)
 *
 * @example
 * const { getByText } = renderWithProviders(<YourComponent />);
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: Providers, ...options });
}

/**
 * Wait for async operations to complete
 * @param ms - milliseconds to wait (default: 50)
 */
export async function waitFor(ms: number = 50) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock API response for testing
 */
export const mockApiResponse = {
  profile: {
    data: {
      id: 1,
      email: 'test@example.com',
      info: { name: 'Test User', coins: 0, largest_streak: 0 },
    },
  },
  habits: {
    data: [],
  },
  userHabits: {
    data: [],
  },
};


