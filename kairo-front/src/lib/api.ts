import {Platform} from 'react-native';
import * as Device from 'expo-device';
import type {ApiError, ApiProfileResponse, LoginResponse, RegisterResponse,} from '@/src/types/apiTypes';
import type {UserAchievementsResponse} from '@/src/types/achievements';
import {getItemAsync} from './secureStore';

export const API_BASE = 'https://kairo.yuri.rocks';

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
// Internal runtime ApiError implementation. We keep the exported `ApiError` type
// in `apiTypes.ts` but throw instances of this class so callers can rely on
// `.status`, `.body` and `.message` being present.
class ApiFetchError extends Error implements ApiError {
  status?: number;
  body?: unknown;
  code?: string | number;

  constructor(message: string, status?: number, body?: unknown, code?: string | number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.code = code;
    // maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      body: this.body,
      code: this.code,
    };
  }
}

export function isApiError(e: unknown): e is ApiError {
  return (
    !!e &&
    typeof e === 'object' &&
    ('status' in (e as object) || 'body' in (e as object) || 'message' in (e as object))
  );
}

export async function apiFetch<Token = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<Token> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const {skipAuth, headers: customHeaders, ...rest} = options;
  const bodyIsFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;

  const headers = mergeHeaders(customHeaders);
  if (bodyIsFormData && headers['Content-Type'] === 'application/json') {
    delete headers['Content-Type'];
  }

  // Add Authorization header unless skipAuth is true
  if (!skipAuth) {
    try {
      const token = await getItemAsync('authToken');
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      // Couldn't read token - don't crash here; callers will handle auth failures.
      console.warn('Failed to read token from secureStore', error);
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {headers, ...rest});
  } catch (err: any) {
    // Network error / CORS / DNS etc. Normalize into ApiFetchError
    const msg = err?.message ?? 'Network request failed';
    throw new ApiFetchError(msg, undefined, null);
  }

  const contentType = response.headers.get('content-type') || '';
  let body: unknown;
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

  // Normalize non-OK responses into ApiFetchError with helpful message/body
  if (!response.ok) {
    // Prefer message from JSON body if present
    let message = `API error ${response.status}`;
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      if (typeof b.message === 'string') message = b.message;
      else if (typeof b.error === 'string') message = b.error;
    } else if (typeof body === 'string' && body.length) {
      message = body;
    } else if (response.statusText) {
      message = response.statusText;
    }

    throw new ApiFetchError(message, response.status, body);
  }

  // Success: return parsed body (may be an object or text). Caller may expect
  // a `{ data: ... }` shape depending on endpoint; keep returning the parsed body.
  return body as Token;
}

// Authentication API calls (For the future we can use react-native-device-info to get an actual device name)
export async function loginRequest(
  email: string,
  password: string,
  device_name?: string,
): Promise<LoginResponse> {
  let deviceName = device_name;
  if (!deviceName) {
    try {
      // Use Expo's device API (works in the managed workflow) and fall back to 'mobile'
      const name = Device.deviceName;
      deviceName = typeof name === 'string' && name.length ? name : 'mobile';
    } catch {
      deviceName = 'mobile';
    }
  }

  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({email, password, device_name: deviceName}),
  });

  return response as LoginResponse;
}

export async function registerRequest(
  email: string,
  password: string,
  device_name?: string,
): Promise<RegisterResponse> {
  let deviceName = device_name;
  if (!deviceName) {
    try {
      const name = Device.deviceName;
      deviceName = typeof name === 'string' && name.length ? name : 'mobile';
    } catch {
      deviceName = 'mobile';
    }
  }

  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({email, password, device_name: deviceName}),
  });

  return response as RegisterResponse;
}

export async function logoutRequest() {
  // Invalidate current token on the server
  return await apiFetch('/api/auth/logout', {
    method: 'DELETE',
  });
}

export async function logoutAllRequest() {
  // Invalidate all sessions for this user on the server
  return await apiFetch('/api/auth/logout-all', {
    method: 'DELETE',
  });
}

// Email verification helpers
export async function sendVerificationNotification(): Promise<{ message?: string } | null> {
  return apiFetch('/api/email/verification-notification', {
    method: 'POST',
  });
}

export async function verifyEmail(id: string, hash: string): Promise<{ message?: string } | null> {
  const path = `/api/email/verify/${encodeURIComponent(id)}/${encodeURIComponent(hash)}`;
  return apiFetch(path, {
    method: 'GET',
  });
}

type ProfileUpdatePayload = {
  name?: string | null;
};

export async function updateProfileRequest(payload: ProfileUpdatePayload) {
  return apiFetch<ApiProfileResponse>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

type AvatarUploadParams = {
  uri: string;
  mimeType?: string | null;
  name?: string | null;
};

export type AvatarUploadResponse = {
  message?: string;
  avatar_url?: string | null;
};

export async function uploadAvatarRequest({uri, mimeType, name}: AvatarUploadParams) {
  const formData = new FormData();
  const filename = name || uri.split('/').pop() || 'avatar.jpg';
  const type = mimeType || 'image/jpeg';

  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append('avatar', blob, filename);
  } else {
    formData.append('avatar', {
      uri,
      name: filename,
      type,
    } as any);
  }
  formData.append('_method', 'PUT'); // Laravel parses files on POST, so spoof PUT via _method

  return apiFetch<AvatarUploadResponse>('/api/profile/avatar', {
    method: 'POST',
    body: formData,
  });
}

export async function deleteAvatarRequest() {
  return apiFetch<AvatarUploadResponse>('/api/profile/avatar', {
    method: 'DELETE',
  });
}

// Achievement API calls
export async function fetchUserAchievements() {
  return apiFetch<UserAchievementsResponse>('/api/achievements');
}
