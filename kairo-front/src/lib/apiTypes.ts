// Shared API response types for profile endpoints
export type ApiProfileInfo = {
  id: number;
  user_id: string;
  name: string | null;
  avatar_url?: string | null;
  streak: number;
  coins: number;
  subscription?: string;
};

export type ApiProfileData = {
  id: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  info?: ApiProfileInfo | null;
};

export type ApiProfileResponse = { data: ApiProfileData };

// Authentication responses
export type LoginResponse = {
  token?: string;
  data?: { token?: string } | null;
  // Allow other shape fields from backend as optional
  [key: string]: unknown;
};

export type RegisterResponse = {
  token?: string;
  data?: { token?: string } | null;
  // Backend may return message/errors
  message?: string;
  errors?: Record<string, string[]>
  [key: string]: unknown;
};

// Generic API error type
export type ApiError = {
  message?: string;
  status?: number;
  body?: unknown;
};
