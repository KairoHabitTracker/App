// Shared API response types for profile endpoints
export type ApiProfileInfo = {
  id: number;
  user_id: number;
  name: string | null;
  avatar_url?: string | null;
  streak: number;
  coins: number;
  subscription?: string;
};

export type ApiProfileData = {
  id: number;
  email: string;
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  info?: ApiProfileInfo | null;
};

export type ApiProfileResponse = { data: ApiProfileData };
