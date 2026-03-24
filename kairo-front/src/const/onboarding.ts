/**
 * Frontend Onboarding Configuration
 * Definiuje wszystkie pytania i kroki onboardingu
 */


export const ONBOARDING_STEPS = ['welcome', 'age', 'interests'] as const;

export const INTERESTS_CATALOG = [
  {id: 'wellbeing', label: 'Well-being', emoji: '🧘'},
  {id: 'healthy_eating', label: 'Healthy eating', emoji: '🥗'},
  {id: 'building_habits', label: 'Building new habits', emoji: '🎯'},
  {id: 'fitness', label: 'Fitness', emoji: '💪'},
  {id: 'mental_health', label: 'Mental health', emoji: '🧠'},
  {id: 'sleep', label: 'Better sleep', emoji: '😴'},
  {id: 'meditation', label: 'Meditation', emoji: '🕉️'},
  {id: 'productivity', label: 'Productivity', emoji: '⚡'},
] as const;

export type InterestId = (typeof INTERESTS_CATALOG)[number]['id'];

export interface OnboardingPayload {
  age: number;
  interests: InterestId[];
  completedAt: string;
}

