// Libraries
import {router} from 'expo-router';
import React, {createContext, useContext, useEffect, useState} from 'react';

// Api
import {apiFetch, loginRequest, logoutAllRequest, logoutRequest} from '@/src/types/api';

// Types
import {ApiProfileResponse} from '@/src/types/apiTypes';
import {UserProfile} from '@/src/types/types';

// Token Storage
import {deleteItemAsync, getItemAsync, setItemAsync} from '@/src/lib/secureStore';


type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, device_name?: string) => Promise<void>;
  loginWithToken: (token: string, redirect?: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
      const json = await apiFetch<ApiProfileResponse>('/api/profile');
      const info = json.data?.info;
      const username = info?.name ?? json.data?.email ?? 'User';
      const avatarUrl = info?.avatar_url ?? null;
      const streak = info?.streak ?? 0;
      const coins = info?.coins ?? 0;

      setUser({ username, avatarUrl, streak, coins });
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
      router.replace('/');
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
      router.replace((redirect ?? '/') as any);
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
    loginWithToken,
    logout,
    logoutAll,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
