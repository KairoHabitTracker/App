import { getItemAsync } from './secureStore';

export const API_BASE = 'https://kairo.iru.codes';

type FetchOptions = RequestInit & { skipAuth?: boolean };

// Fetch wrapper that adds token when possible
export async function apiFetch(path: string, options: FetchOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const { skipAuth, headers: customHeaders, ...rest } = options as any;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(customHeaders || {}),
  };

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
  let body: any = null;
  if (contentType.includes('application/json')) {
    body = await response.json().catch(() => null);
  } else {
    body = await response.text().catch(() => null);
  }

  if (!response.ok) {
    const error: any = new Error(`API error ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

// Authentication API calls (For the future we can use react-native-device-info to get an actual device name)
export async function loginRequest(email: string, password: string, device_name = 'mobile') {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password, device_name }),
  });

  return response;
}

export async function registerRequest(email: string, password: string, device_name = 'mobile') {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password, device_name }),
  });

  return response;
}
