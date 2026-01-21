import {useCallback, useEffect, useMemo, useState} from 'react';
import {fetchUserAchievements} from '@/src/lib/api';
import type {UserAchievement} from '@/src/types/achievements';

const POINTS_PER_BADGE = 50;

export function useAchievements() {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUserAchievements();
      setAchievements(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load achievements', err);
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const stats = useMemo(() => {
    const total = achievements.length;
    const unlockedCount = achievements.filter((achievement) => Boolean(achievement.unlocked_at)).length;
    const lockedCount = Math.max(total - unlockedCount, 0);
    const pointsEarned = unlockedCount * POINTS_PER_BADGE;

    return {
      total,
      unlockedCount,
      lockedCount,
      pointsEarned,
    };
  }, [achievements]);

  return {
    achievements,
    loading,
    error,
    refresh: loadAchievements,
    ...stats,
  };
}
