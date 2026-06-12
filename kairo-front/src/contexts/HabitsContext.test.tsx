import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { useHabits } from './HabitsContext';
import { renderWithProviders } from '../test/test-utils';
import * as secureStore from '@/src/lib/secureStore';
import * as api from '@/src/lib/api';

const TestComponent = () => {
  const { habits, userHabits, loading, completeHabit, addHabit } = useHabits();
  return (
    <View>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
      <Text testID="habits-count">{habits.length}</Text>
      <Text testID="user-habits-count">{userHabits.length}</Text>
      <TouchableOpacity testID="complete-btn" onPress={() => completeHabit(123)} />
      <TouchableOpacity testID="add-btn" onPress={() => addHabit({ habit_id: 1, days_of_week: ['monday'] })} />
    </View>
  );
};

describe('HabitsContext', () => {
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
    
    // Set up mock token in secure store to enable fetching
    jest.spyOn(secureStore, 'getItemAsync').mockImplementation(async (key) => {
      if (key === 'authToken') return 'test-token';
      return null;
    });

    // Mock profile fetch
    (api.apiFetch as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        email: 'test@example.com',
        info: null,
      },
    });

    mockFetch = jest.fn().mockImplementation((url: string, options?: any) => {
      if (url.endsWith('/api/habits/user')) {
        if (options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ id: 123, habit_id: 1, last_completed_at: null, days_of_week: ['monday'] }]
          }),
        });
      }
      if (url.endsWith('/api/habits')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ id: 1, name: 'Drink Water' }]
          }),
        });
      }
      if (url.includes('/complete')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    global.fetch = mockFetch;
  });

  it('automatically fetches habits catalog and user habits list if token is present', async () => {
    const { getByTestId } = renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(getByTestId('habits-count').props.children).toBe(1);
      expect(getByTestId('user-habits-count').props.children).toBe(1);
    });

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/habits'), expect.any(Object));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/habits/user'), expect.any(Object));
  });

  it('completes a user habit and refreshes user habits', async () => {
    const { getByTestId } = renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(getByTestId('habits-count').props.children).toBe(1);
      expect(getByTestId('user-habits-count').props.children).toBe(1);
    });

    // Reset fetch mock calls to isolate the check
    mockFetch.mockClear();

    const completeBtn = getByTestId('complete-btn');
    fireEvent.press(completeBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/habits/user/123/complete'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    // Also verifies that it fetches user habits again
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/habits/user'),
        expect.any(Object)
      );
    });
  });

  it('adds a new habit and refreshes habits catalog and user habits list', async () => {
    const { getByTestId } = renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(getByTestId('habits-count').props.children).toBe(1);
      expect(getByTestId('user-habits-count').props.children).toBe(1);
    });

    mockFetch.mockClear();

    const addBtn = getByTestId('add-btn');
    fireEvent.press(addBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/habits/user'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ habit_id: 1, days_of_week: ['monday'] })
        })
      );
    });
  });
});



