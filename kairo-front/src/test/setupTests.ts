// Minimal setup dla Jest w Expo projekcie
import '@testing-library/jest-native/extend-expect';

// Gesture handler setup
import 'react-native-gesture-handler/jestSetup';

// ===== CRITICAL: Mock Expo Router (unika nawigacji w test env) =====
jest.mock('expo-router', () => ({
  Stack: ({ children }: any) => children ?? null,
  Tabs: ({ children }: any) => children ?? null,
  Link: ({ children }: any) => children ?? null,
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: () => false,
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  usePathname: () => '/',
}));

// ===== CRITICAL: Mock API module (unika fetch do backendu) =====
jest.mock('@/src/lib/api', () => ({
  API_BASE: 'https://mock-api.local',
  apiFetch: jest.fn(async () => ({
    data: {
      id: 1,
      email: 'test@example.com',
      info: { name: 'Test User', coins: 0, largest_streak: 0 },
    },
  })),
  loginRequest: jest.fn(async () => ({ token: 'mock-token-123' })),
  logoutRequest: jest.fn(async () => ({})),
  logoutAllRequest: jest.fn(async () => ({})),
  registerRequest: jest.fn(async () => ({ token: 'mock-token-123' })),
  updateProfileRequest: jest.fn(async () => ({})),
  uploadAvatarRequest: jest.fn(async () => ({ avatar_url: null })),
  sendVerificationNotification: jest.fn(async () => ({})),
  verifyEmail: jest.fn(async () => ({})),
  isApiError: jest.fn(() => false),
}));

// ===== CRITICAL: Mock secure store (unika natywnego storage) =====
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(async () => {}),
  getItemAsync: jest.fn(async () => null),
  deleteItemAsync: jest.fn(async () => {}),
}));

// ===== Mock AsyncStorage =====
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ===== Mock Expo notifications (unika native permissions) =====
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => 'mock-notif-id'),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => {}),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
}));

// ===== Mock Expo System UI =====
jest.mock('expo-system-ui', () => ({
  setBackgroundColorAsync: jest.fn(async () => {}),
}));

// ===== Mock useLocalNotifications hook (HabitsContext zależy) =====
jest.mock('@/src/hooks/useLocalNotifications', () => ({
  useLocalNotifications: () => ({
    scheduleHabitReminders: jest.fn(async () => true),
    cancelAllNotifications: jest.fn(async () => {}),
    permissionsGranted: true,
  }),
}));








