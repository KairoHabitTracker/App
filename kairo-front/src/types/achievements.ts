export type Achievement = {
  id: number;
  identifier: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserAchievement = {
  id: number;
  user_id: string;
  achievement_id: number;
  unlocked_at: string | null;
  created_at: string;
  updated_at: string;
  achievement: Achievement;
  // Backend may extend progress info in the future; keep optional fields ready.
  // progress_current?: number | null;
  // progress_target?: number | null;
  // progress_percentage?: number | null;
};

export type UserAchievementsResponse = {
  data: UserAchievement[];
};
