import React from 'react';
import { waitFor } from '@testing-library/react-native';
import Home from './home';
import { renderWithProviders } from '@/src/test/test-utils';
import * as api from '@/src/lib/api';
import * as secureStore from '@/src/lib/secureStore';

const apiFetchMock = api.apiFetch as jest.Mock;

describe('HomeScreen', () => {
  let originalFetch: any;
  let mockFetch: jest.Mock;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock secure store to return token to trigger API calls in context
    jest.spyOn(secureStore, 'getItemAsync').mockImplementation(async (key) => {
      if (key === 'authToken') return 'valid-token';
      return null;
    });

    // Mock profile fetch returning a streak of 7
    apiFetchMock.mockResolvedValue({
      data: {
        id: 1,
        email: 'test@example.com',
        info: { name: 'Streak Champion', coins: 100, largest_streak: 7, streak: 7 },
      },
    });

    // Mock fetch for HabitsContext
    mockFetch = jest.fn().mockImplementation((url: string) => {
      if (url.endsWith('/api/habits/user')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [
              {
                id: 101,
                habit_id: 1,
                last_completed_at: null,
                days_of_week: [
                  new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                ],
                habit: {
                  id: 1,
                  name: 'Daily Hydration',
                  emoji: '💧',
                  hex_color: '#3B82F6',
                }
              }
            ]
          }),
        });
      }
      if (url.endsWith('/api/habits')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
    global.fetch = mockFetch;
  });

  it('renders Today header, formatted current date, and user streak', async () => {
    const { getByText } = renderWithProviders(<Home />);

    await waitFor(() => {
      expect(getByText('Today')).toBeTruthy();
      expect(getByText('7')).toBeTruthy(); // streak value
    });

    // Verify formatted date exists
    const expectedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    expect(getByText(expectedDate)).toBeTruthy();
  });

  it('renders list of user habits scheduled for today', async () => {
    const { getByText } = renderWithProviders(<Home />);

    await waitFor(() => {
      expect(getByText('Daily Hydration')).toBeTruthy();
      expect(getByText('💧')).toBeTruthy();
    });
  });
});
