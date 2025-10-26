import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, loginRequest } from '../lib/api';
import { deleteItemAsync, getItemAsync, setItemAsync } from '../lib/secureStore';

type ApiProfileInfo = {
  id: number;
  user_id: number;
  name: string | null;
  avatar_url?: string | null;
  streak: number;
  coins: number;
};

type ApiProfileData = {
  id: number;
  email: string;
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  info?: ApiProfileInfo | null;
};

type ApiProfileResponse = { data: ApiProfileData };

export type UserProfile = {
  username: string;
  streak: number;
  coins: number;
  avatarUrl?: string | null;
};

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, device_name?: string) => Promise<void>;
  logout: () => Promise<void>;
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

  async function fetchProfile() {
    try {
      const json: ApiProfileResponse = await apiFetch('/api/profile');
      const info = json.data?.info;
      const username = info?.name ?? json.data?.email ?? 'User';
      const avatarUrl = info?.avatar_url ?? null;
      const streak = info?.streak ?? 0;
      const coins = info?.coins ?? 0;

      setUser({ username, avatarUrl, streak, coins });
    } catch (error: any) {
      // If 401, clear token and redirect to login
      if (error?.status === 401) {
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
      const response: any = await loginRequest(email, password, device_name);
      const tokenFromServer = response?.token;
      if (!tokenFromServer) throw new Error('No token in response');
      await setItemAsync('authToken', tokenFromServer);
      setToken(tokenFromServer);
      // Fetch profile after saving token
      await fetchProfile();
      router.replace('/');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      // notify server to invalidate this token (best-effort)
      await logoutRequest();
    } catch (error) {
      // ignore server errors; still clear local session
      console.warn('logout api error', error);
    }
    await deleteItemAsync('authToken');
    setToken(null);
    setUser(null);
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

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    logoutAll,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
