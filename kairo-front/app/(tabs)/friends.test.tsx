import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import FriendsScreen from './friends';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { TamaguiProvider } from '@tamagui/core';
import { config } from '@/tamagui.config';
import { useFriends } from '@/src/hooks/useFriends';

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

// Mock useAuth context hook directly to avoid loading states and routing side effects
jest.mock('@/src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-123', username: 'testuser' },
  }),
}));

const useFriendsMock = useFriends as jest.Mock;

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <TamaguiProvider config={config}>
      {ui}
    </TamaguiProvider>
  );
};

describe('FriendsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when isLoading is true', () => {
    useFriendsMock.mockReturnValue({
      friends: [],
      invitations: [],
      isLoading: true,
      isSending: false,
      invite: '',
      setInvite: jest.fn(),
      loadData: jest.fn(),
      sendInvitation: jest.fn(),
      acceptInvitation: jest.fn(),
      rejectInvitation: jest.fn(),
    });

    const { queryByText } = renderWithTheme(<FriendsScreen />);
    
    // Header should not be visible when showing full screen loader
    expect(queryByText('ALL FRIENDS')).toBeNull();
  });

  it('renders empty state when there are no friends or invitations', () => {
    useFriendsMock.mockReturnValue({
      friends: [],
      invitations: [],
      isLoading: false,
      isSending: false,
      invite: '',
      setInvite: jest.fn(),
      loadData: jest.fn(),
      sendInvitation: jest.fn(),
      acceptInvitation: jest.fn(),
      rejectInvitation: jest.fn(),
    });

    const { getByText } = renderWithTheme(<FriendsScreen />);

    expect(getByText('No friends yet. Add someone!')).toBeTruthy();
    expect(getByText('Invite Friends')).toBeTruthy();
  });

  it('renders list of friends and pending invitations correctly', () => {
    const acceptInvitationMock = jest.fn();
    const rejectInvitationMock = jest.fn();
    
    useFriendsMock.mockReturnValue({
      friends: [
        { id: 'friend-1', email: 'friend1@example.com', info: { name: 'Alice' } },
        { id: 'friend-2', email: 'friend2@example.com', info: null },
      ],
      invitations: [
        {
          id: 'invite-1',
          sender: { id: 'sender-1', email: 'sender1@example.com', info: { name: 'Bob' } },
        }
      ],
      isLoading: false,
      isSending: false,
      invite: '',
      setInvite: jest.fn(),
      loadData: jest.fn(),
      sendInvitation: jest.fn(),
      acceptInvitation: acceptInvitationMock,
      rejectInvitation: rejectInvitationMock,
    });

    const { getByText, getByTestId } = renderWithTheme(<FriendsScreen />);

    // Check friends list header and names
    expect(getByText('ALL FRIENDS (2)')).toBeTruthy();
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('friend2@example.com')).toBeTruthy(); // uses email when info.name is null

    // Check pending invitations header and sender
    expect(getByText('PENDING INVITATIONS (1)')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();

    // Check button triggers for accept / reject
    const acceptBtn = getByTestId('accept-btn-invite-1');
    const rejectBtn = getByTestId('reject-btn-invite-1');

    fireEvent.press(acceptBtn);
    expect(acceptInvitationMock).toHaveBeenCalledWith('invite-1');

    fireEvent.press(rejectBtn);
    expect(rejectInvitationMock).toHaveBeenCalledWith('invite-1');
  });
});
