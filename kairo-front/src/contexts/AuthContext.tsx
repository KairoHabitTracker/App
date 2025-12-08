// Libraries
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Api
import { apiFetch, loginRequest, logoutAllRequest, logoutRequest, verifyEmail } from '../lib/api';

// Types
import { ApiProfileResponse } from '../lib/apiTypes';
import { UserProfile } from '../lib/types';

// Token Storage
import { deleteItemAsync, getItemAsync, setItemAsync } from '../lib/secureStore';


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

  // Process verification links (either initial link or incoming url events)
  async function processVerificationUrl(url: string | null) {
    if (!url) return;
    try {
      const parsed = Linking.parse(url);
      const path = parsed.path;
      if (!path) return;
      const parts = path.split('/').filter(Boolean);
      // find "verify" segment
      const verifyIdx = parts.findIndex((p) => p === 'verify');
      if (verifyIdx === -1) return;
      const id = parts[verifyIdx + 1];
      const hash = parts[verifyIdx + 2];
      if (!id || !hash) return;

      const currentToken = token ?? (await getItemAsync('authToken'));
      if (currentToken) {
        try {
          await verifyEmail(id, hash);
          await fetchProfile();
          // navigate to a result screen
          router.replace({ pathname: '/verify-result', params: { status: 'success' } } as any);
        } catch (err: any) {
          if (err?.status === 403) {
            router.replace({ pathname: '/verify-result', params: { status: 'invalid' } } as any);
          } else if (err?.status === 401) {
            // save pending and navigate to login
            await setItemAsync('pendingVerificationUrl', url);
            router.replace('/login');
          } else {
            router.replace({ pathname: '/verify-result', params: { status: 'error', message: String(err?.message ?? 'Unknown error') } } as any);
          }
        }
      } else {
        // Not authenticated: store the link and send user to login
        await setItemAsync('pendingVerificationUrl', url);
        router.replace('/login');
      }
    } catch (err) {
      console.warn('Failed to process verification URL', err);
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
        // Check initial linking URL when app starts
        try {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) await processVerificationUrl(initialUrl);
        } catch (e) {
          // ignore
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Listen for incoming links while app is running
  useEffect(() => {
    const subscription = Linking.addEventListener('url', (ev) => {
      processVerificationUrl(ev.url);
    });
    return () => {
      try {
        subscription.remove();
      } catch {}
    };
  }, [token]);

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
      // If there is a pending verification URL (from link clicked when unauthenticated), process it now
      try {
        const pending = await getItemAsync('pendingVerificationUrl');
        if (pending) {
          await deleteItemAsync('pendingVerificationUrl');
          await processVerificationUrl(pending);
          return;
        }
      } catch (e) {
        // ignore
      }

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
