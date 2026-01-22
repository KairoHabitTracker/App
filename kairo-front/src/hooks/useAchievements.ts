import {useCallback, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserAchievements} from '@/src/lib/api';
import type {UserAchievement} from '@/src/types/achievements';
import {useAuth} from '@/src/contexts/AuthContext';

const ACHIEVEMENT_REWARD = 50;
const REWARDED_STORAGE_PREFIX = 'rewarded_achievements:';

const getRewardedStorageKey = (userId: string) => `${REWARDED_STORAGE_PREFIX}${userId}`;

const sanitizeRewardedIds = (raw: unknown): number[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((value) => Number(value))
    .filter((value): value is number => Number.isFinite(value));
};

function persistRewardedIds(userId: string, ids: number[]) {
  AsyncStorage.setItem(getRewardedStorageKey(userId), JSON.stringify(ids)).catch((error) => {
    console.warn('Failed to persist rewarded achievements', error);
  });
}

export function useAchievements() {
  const {user, applyCoinBonus} = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rewardedIds, setRewardedIds] = useState<number[]>([]);
  const [rewardedReady, setRewardedReady] = useState(false);
  const [pendingRewardAmount, setPendingRewardAmount] = useState(0);

  const userId = user?.id;

  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      setRewardedIds([]);
      setRewardedReady(false);
      return;
    }

    setRewardedReady(false);

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(getRewardedStorageKey(userId));
        if (cancelled) return;
        const parsed = raw ? JSON.parse(raw) : [];
        setRewardedIds(sanitizeRewardedIds(parsed));
      } catch (storageError) {
        console.warn('Failed to load rewarded achievements', storageError);
        if (!cancelled) setRewardedIds([]);
      } finally {
        if (!cancelled) setRewardedReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const processRewards = useCallback((list: UserAchievement[]) => {
    if (!userId || !rewardedReady || !list.length) return;

    setRewardedIds((prev) => {
      const previous = new Set(prev);
      const unlockedIds = list
        .filter((entry) => Boolean(entry.unlocked_at))
        .map((entry) => entry.id);
      const newlyUnlocked = unlockedIds.filter((id) => !previous.has(id));

      if (!newlyUnlocked.length) {
        return prev;
      }

      const updated = Array.from(new Set([...previous, ...newlyUnlocked]));
      persistRewardedIds(userId, updated);
      setPendingRewardAmount((amount) => amount + newlyUnlocked.length * ACHIEVEMENT_REWARD);
      return updated;
    });
  }, [rewardedReady, userId]);

  useEffect(() => {
    if (pendingRewardAmount <= 0) return;
    applyCoinBonus(pendingRewardAmount);
    setPendingRewardAmount(0);
  }, [applyCoinBonus, pendingRewardAmount]);

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUserAchievements();
      const list = Array.isArray(response?.data) ? response.data : [];
      setAchievements(list);
      processRewards(list);
    } catch (err) {
      console.error('Failed to load achievements', err);
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, [processRewards]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  useEffect(() => {
    if (rewardedReady) {
      processRewards(achievements);
    }
  }, [achievements, processRewards, rewardedReady]);

  const stats = useMemo(() => {
    const total = achievements.length;
    const unlockedCount = achievements.filter((achievement) => Boolean(achievement.unlocked_at)).length;
    const lockedCount = Math.max(total - unlockedCount, 0);

    return {
      total,
      unlockedCount,
      lockedCount,
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