import { apiFetch } from '@/src/lib/api';
import {
  getMockHabitCompletions,
  getMockHabits,
  isAnalyticsMockEnabled,
} from './devAnalyticsMock';

export type Habit = {
  id: string | number;
  name: string;
  category?: string;
  created_at: string;
  // additional fields based on actual API response
};

export type Completion = {
  id: string | number;
  habit_id: string | number;
  completed_at: string; // ISO date string
  status?: string;
};

// Data Fetchers
export async function fetchAllUserHabits(): Promise<Habit[]> {
  if (isAnalyticsMockEnabled()) {
    return getMockHabits() as Habit[];
  }

  try {
    const defaultHabits: { data: Habit[] } = await apiFetch('/api/habits/user');
    const customHabits: { data: Habit[] } = await apiFetch('/api/habits/custom');
    return [...(defaultHabits.data || []), ...(customHabits.data || [])];
  } catch (error) {
    console.warn('Failed to fetch user habits', error);
    return [];
  }
}

export async function fetchHabitCompletions(habitId: string | number): Promise<Completion[]> {
  if (isAnalyticsMockEnabled()) {
    return getMockHabitCompletions(habitId) as Completion[];
  }

  try {
    const res: { data: Completion[] } = await apiFetch(`/api/habits/user/${habitId}/completions`);
    return res.data || [];
  } catch (error) {
    console.warn(`Failed to fetch completions for habit ${habitId}`, error);
    return [];
  }
}

export async function fetchHealthSync(): Promise<any> {
  try {
    const res = await apiFetch('/api/health/sync');
    return res;
  } catch (error) {
    console.warn('Failed to sync health data', error);
    return null;
  }
}

// Analytics Computations

/**
 * Calculates the percentage of days in the last 7 days that had at least one completion.
 */
export function computeWeeklyCompletionRate(completions: Completion[]): number {
  if (!completions.length) return 0;
  
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const recentCompletions = completions.filter(c => new Date(c.completed_at) >= sevenDaysAgo);
  
  // Get unique days
  const uniqueDays = new Set(recentCompletions.map(c => new Date(c.completed_at).toDateString()));
  return Math.min(100, Math.round((uniqueDays.size / 7) * 100));
}

/**
 * Momentum Score: A weighted 14-day moving average.
 * Recent days are weighted heavier. Missed days gently reduce the score.
 */
export function computeMomentumScore(completions: Completion[]): number {
  if (!completions.length) return 0;

  let score = 0;
  const now = new Date();
  
  // Get unique completion dates
  const completedDates = new Set(completions.map(c => new Date(c.completed_at).toDateString()));

  // 14 days weights (recent days have higher weights, sum of weights = 1)
  const weights = Array.from({ length: 14 }, (_, i) => 14 - i);
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  for (let i = 0; i < 14; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    if (completedDates.has(date.toDateString())) {
      score += (weights[i] / totalWeight) * 100;
    }
  }

  return Math.round(score);
}

/**
 * Recovery Rate: (Number of times a habit was completed the day *after* a missed day) / (Total missed days).
 */
export function computeRecoveryRate(completions: Completion[], accountCreatedAt: Date): number {
  if (!completions.length) return 0;

  const completedDates = new Set(completions.map(c => new Date(c.completed_at).toDateString()));
  
  let missedDays = 0;
  let recoveredDays = 0;
  
  const now = new Date();
  const msInDay = 24 * 60 * 60 * 1000;
  const daysSinceCreation = Math.floor((now.getTime() - accountCreatedAt.getTime()) / msInDay);
  
  for (let i = 1; i <= daysSinceCreation; i++) {
    const d = new Date(accountCreatedAt.getTime() + i * msInDay);
    const dateStr = d.toDateString();
    const prevDateStr = new Date(d.getTime() - msInDay).toDateString();
    
    const missedYesterday = !completedDates.has(prevDateStr);
    const completedToday = completedDates.has(dateStr);
    
    if (missedYesterday) {
      missedDays++;
      if (completedToday) {
        recoveredDays++;
      }
    }
  }
  
  if (missedDays === 0) return 100;
  return Math.round((recoveredDays / missedDays) * 100);
}
