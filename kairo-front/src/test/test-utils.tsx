import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { HabitsProvider } from '@/src/contexts/HabitsContext';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <HabitsProvider>{children}</HabitsProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export function renderWithProviders(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: Providers, ...options });
}

