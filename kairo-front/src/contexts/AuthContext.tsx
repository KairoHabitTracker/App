// Libraries
import {router} from 'expo-router';
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Api
import {apiFetch, loginRequest, logoutAllRequest, logoutRequest} from '@/src/lib/api';

// Types
import {ApiProfileResponse} from '@/src/types/apiTypes';
import {UserProfile} from '@/src/types/types';

// Token Storage
import {deleteItemAsync, getItemAsync, setItemAsync} from '@/src/lib/secureStore';

const PENDING_COINS_KEY_PREFIX = 'pending_coins:';

const getPendingCoinsStorageKey = (userId: string) => `${PENDING_COINS_KEY_PREFIX}${userId}`;

async function readPendingCoins(userId: string): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(getPendingCoinsStorageKey(userId));
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    console.warn('Failed to read pending coins', error);
    return 0;
  }
}

function persistPendingCoins(userId: string, amount: number) {
  AsyncStorage.setItem(getPendingCoinsStorageKey(userId), String(amount)).catch((error) => {
    console.warn('Failed to persist pending coins', error);
  });
}


type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, device_name?: string) => Promise<void>;
  loginWithToken: (token: string, redirect?: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  pendingCoins: number;
  applyCoinBonus: (amount: number) => void;
  acknowledgeCoinBonus: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [coinOffset, setCoinOffset] = useState(0);
  const [pendingCoins, setPendingCoins] = useState(0);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingTimer = useCallback(() => {
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
  }, []);

  async function fetchProfile() {
    try {
      const json = await apiFetch<ApiProfileResponse>('/api/profile');
      const userId = json.data?.id;
      const info = json.data?.info;
      const username = info?.name ?? json.data?.email ?? 'User';
      const avatarUrl = info?.avatar_url ?? null;
      const coins = info?.coins ?? 0;
      const streak = info?.largest_streak ?? 0;


      setUser({id: userId, username, avatarUrl, streak, coins});
    } catch (error: unknown) {
      // If 401, clear token and redirect to login
      if (typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 401) {
        await deleteItemAsync('authToken');
        setToken(null);
        setUser(null);
        router.replace('/login');
      }
      throw error;
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const token = await getItemAsync('authToken');
        if (mounted) setToken(token);
        if (token) {
          try {
            await fetchProfile();
          } catch (error) {
            // Already handled inside fetchProfile
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  async function login(email: string, password: string, device_name = 'mobile') {
    setLoading(true);
    try {
  const response = await loginRequest(email, password, device_name);
  const tokenFromServer = response?.token ?? response?.data?.token;
      if (!tokenFromServer) throw new Error('No token in response');
      await setItemAsync('authToken', tokenFromServer);
      setToken(tokenFromServer);
      // Fetch profile after saving token
      await fetchProfile();
      // After successful login/profile fetch, navigate to the home tab.
      router.replace('/home');
    } finally {
      setLoading(false);
    }
  }

  async function loginWithToken(tokenFromServer: string, redirect?: string) {
    setLoading(true);
    try {
      await setItemAsync('authToken', tokenFromServer);
      setToken(tokenFromServer);
      // Fetch profile after saving token
      await fetchProfile();
      router.replace((redirect ?? '/home') as any);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      // Send logout request to server
      await logoutRequest();
    } catch (error) {
      // Ignore errors, clear token anyway
      console.warn('logout api error', error);
    }
    await deleteItemAsync('authToken');
    setToken(null);
    setUser(null);
    setCoinOffset(0);
    setPendingCoins(0);
    router.replace('/login');
  }

  async function logoutAll() {
    try {
      await logoutAllRequest();
    } catch (error) {
      console.warn('logoutAll api error', error);
    }
    await deleteItemAsync('authToken');
    setToken(null);
    setUser(null);
    setCoinOffset(0);
    setPendingCoins(0);
    router.replace('/login');
  }

  async function refreshProfile() {
    setLoading(true);
    try {
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.id) {
        if (!cancelled) {
          setCoinOffset(0);
          setPendingCoins(0);
        }
        return;
      }
      if (!cancelled) {
        setCoinOffset(0);
        setPendingCoins(0);
      }
      const stored = await readPendingCoins(user.id);
      if (!cancelled) setCoinOffset(stored);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const applyCoinBonus = useCallback((amount: number) => {
    if (!user?.id || amount <= 0) return;
    setCoinOffset((prev) => {
      const next = prev + amount;
      persistPendingCoins(user.id!, next);
      return next;
    });
    setPendingCoins((prev) => prev + amount);
  }, [user?.id]);

  const acknowledgeCoinBonus = useCallback(() => {
    cancelPendingTimer();
    setPendingCoins(0);
  }, [cancelPendingTimer]);

  useEffect(() => {
    if (pendingCoins <= 0) {
      cancelPendingTimer();
      return;
    }

    cancelPendingTimer();
    pendingTimerRef.current = setTimeout(() => {
      setPendingCoins(0);
      pendingTimerRef.current = null;
    }, 4000);

    return cancelPendingTimer;
  }, [cancelPendingTimer, pendingCoins]);

  useEffect(() => {
    return () => {
      cancelPendingTimer();
    };
  }, [cancelPendingTimer]);

  const decoratedUser = user ? {...user, coins: user.coins + coinOffset} : null;

  const value: AuthContextType = {
    user: decoratedUser,
    token,
    loading,
    login,
    loginWithToken,
    logout,
    logoutAll,
    refreshProfile,
    pendingCoins,
    applyCoinBonus,
    acknowledgeCoinBonus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
