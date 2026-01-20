// Shared UI-level types
export type UserProfile = {
  id: string;
  username: string;
  streak: number;
  coins: number;
  avatarUrl?: string | null;
  subscription?: string;
};
