import type { ApiError, LoginResponse, RegisterResponse } from './apiTypes';
import { getItemAsync } from './secureStore';

export const API_BASE = 'https://kairo.iru.codes';

type FetchOptions = RequestInit & { skipAuth?: boolean };

function mergeHeaders(custom?: HeadersInit): Record<string, string> {
  const base: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (!custom) return base;
  if (custom instanceof Headers) {
    custom.forEach((value, key) => {
      base[key] = value;
    });
    return base;
  }
  if (Array.isArray(custom)) {
    (custom as [string, string][]).forEach(([key, value]) => (base[key] = value));
    return base;
  }
  // plain object
  Object.assign(base, custom as Record<string, string>);
  return base;
}

// Fetch wrapper that adds token when possible
export async function apiFetch<Token = unknown>(path: string, options: FetchOptions = {}): Promise<Token> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const { skipAuth, headers: customHeaders, ...rest } = options;

  const headers = mergeHeaders(customHeaders);

  // Add Authorization header unless skipAuth is true
  if (!skipAuth) {
    try {
      const token = await getItemAsync('authToken');
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      // Ignore; caller will handle unauthorized
      console.warn('Failed to read token from secureStore', error);
    }
  }

  const response = await fetch(url, { headers, ...rest });

  const contentType = response.headers.get('content-type') || '';
  let body: unknown = null;
  if (contentType.includes('application/json')) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  } else {
    try {
      body = await response.text();
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const error = new Error(`API error ${response.status}`) as Error & ApiError;
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body as Token;
}

// Authentication API calls (For the future we can use react-native-device-info to get an actual device name)
export async function loginRequest(email: string, password: string, device_name = 'mobile'): Promise<LoginResponse> {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password, device_name }),
  });

  return response as LoginResponse;
}

export async function registerRequest(email: string, password: string, device_name = 'mobile'): Promise<RegisterResponse> {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password, device_name }),
  });

  return response as RegisterResponse;
}

export async function logoutRequest() {
  // Invalidate current token on the server
  const res = await apiFetch('/api/auth/logout', {
    method: 'DELETE',
  });
  return res;
}

export async function logoutAllRequest() {
  // Invalidate all sessions for this user on the server
  const res = await apiFetch('/api/auth/logout-all', {
    method: 'DELETE',
  });
  return res;
}