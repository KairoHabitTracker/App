// Shared UI-level types
export type UserProfile = {
  username: string;
  streak: number;
  coins: number;
  avatarUrl?: string | null;
  subscription?: string;
};
