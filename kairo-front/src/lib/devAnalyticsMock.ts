type MockHabit = {
  id: string | number;
  name: string;
  category?: string;
  created_at: string;
};

type MockCompletion = {
  id: string | number;
  habit_id: string | number;
  completed_at: string;
  status?: string;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

let analyticsMockEnabled = false;

function toIsoDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function toIsoMonthsAgo(monthsAgo: number, dayOfMonth: number = 12): string {
  const date = new Date();
  date.setHours(9, 0, 0, 0);
  date.setDate(1);
  date.setMonth(date.getMonth() - monthsAgo);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(dayOfMonth, lastDayOfMonth));
  return date.toISOString();
}

function createHabit(id: string, name: string, category: string, monthsAgoCreated: number): MockHabit {
  return {
    id,
    name,
    category,
    created_at: toIsoMonthsAgo(monthsAgoCreated),
  };
}

function createCompletions(
  habitId: string,
  key: string,
  daysAgoList: number[],
  monthsAgoList: number[]
): MockCompletion[] {
  const completions: MockCompletion[] = [];

  daysAgoList.forEach((daysAgo, index) => {
    completions.push({
      id: `${key}-day-${index + 1}`,
      habit_id: habitId,
      completed_at: toIsoDaysAgo(daysAgo),
      status: 'completed',
    });
  });

  monthsAgoList.forEach((monthsAgo, index) => {
    completions.push({
      id: `${key}-month-${index + 1}`,
      habit_id: habitId,
      completed_at: toIsoMonthsAgo(monthsAgo, 15),
      status: 'completed',
    });
  });

  return completions;
}

const mockHabits: MockHabit[] = [
  createHabit('mock-habit-1', 'Morning Run', 'health', 5),
  createHabit('mock-habit-7', 'Drink Water', 'health', 4),
  createHabit('mock-habit-2', 'Deep Work', 'productivity', 5),
  createHabit('mock-habit-3', 'Read 20 Pages', 'learning', 4),
  createHabit('mock-habit-8', 'Go To Classes', 'learning', 4),
  createHabit('mock-habit-9', 'Practice Flashcards', 'learning', 3),
  createHabit('mock-habit-4', 'Call Family', 'social', 4),
  createHabit('mock-habit-5', 'Clean Desk', 'chores', 3),
  createHabit('mock-habit-6', 'Mobility Flow', 'physical wellbeing', 5),
  createHabit('mock-habit-10', 'Meal Prep', 'chores', 3),
];

const mockCompletionsByHabitId: Record<string, MockCompletion[]> = {
  'mock-habit-1': createCompletions(
    'mock-habit-1',
    'morning-run',
    [0, 1, 2, 4, 6, 8, 10, 13, 16, 18, 21, 24, 27],
    [0, 1, 2, 3, 4, 5]
  ),
  'mock-habit-2': createCompletions(
    'mock-habit-2',
    'deep-work',
    [0, 2, 3, 5, 7, 9, 12, 16, 19, 23, 26],
    [0, 1, 2, 3, 4, 5]
  ),
  'mock-habit-7': createCompletions(
    'mock-habit-7',
    'drink-water',
    [0, 1, 3, 4, 6, 8, 11, 13, 17, 20, 24, 27],
    [0, 1, 2, 3, 4]
  ),
  'mock-habit-3': createCompletions(
    'mock-habit-3',
    'read-pages',
    [1, 2, 4, 6, 8, 11, 14, 18, 21, 25],
    [0, 1, 2, 3, 4, 5]
  ),
  'mock-habit-8': createCompletions(
    'mock-habit-8',
    'go-to-classes',
    [0, 3, 7, 10, 14, 17, 20, 24],
    [0, 1, 2, 3, 4, 5]
  ),
  'mock-habit-9': createCompletions(
    'mock-habit-9',
    'practice-flashcards',
    [2, 5, 9, 12, 15, 19, 22, 26],
    [0, 1, 2, 3, 4]
  ),
  'mock-habit-4': createCompletions(
    'mock-habit-4',
    'family-call',
    [2, 9, 16, 23],
    [0, 1, 2, 3, 4, 5]
  ),
  'mock-habit-5': createCompletions(
    'mock-habit-5',
    'clean-desk',
    [5, 12, 19, 26],
    [0, 1, 2, 3, 4, 5]
  ),
  'mock-habit-6': createCompletions(
    'mock-habit-6',
    'mobility-flow',
    [0, 3, 6, 10, 14, 18, 22, 27],
    [0, 1, 2, 3, 4, 5]
  ),
  'mock-habit-10': createCompletions(
    'mock-habit-10',
    'meal-prep',
    [1, 6, 13, 20, 27],
    [0, 1, 2, 3]
  ),
};

export function isAnalyticsMockEnabled(): boolean {
  return analyticsMockEnabled;
}

export function setAnalyticsMockEnabled(enabled: boolean): void {
  analyticsMockEnabled = enabled;
}

export function toggleAnalyticsMockEnabled(): boolean {
  analyticsMockEnabled = !analyticsMockEnabled;
  return analyticsMockEnabled;
}

export function getMockHabits(): MockHabit[] {
  return mockHabits.map(habit => ({ ...habit }));
}

export function getMockHabitCompletions(habitId: string | number): MockCompletion[] {
  return [...(mockCompletionsByHabitId[String(habitId)] || [])].sort(
    (left, right) => new Date(left.completed_at).getTime() - new Date(right.completed_at).getTime()
  );
}

export function getMockAllCompletions(): MockCompletion[] {
  return Object.values(mockCompletionsByHabitId)
    .flat()
    .sort((left, right) => new Date(left.completed_at).getTime() - new Date(right.completed_at).getTime());
}

export function getMockWeeklyChartData(): { x: string; y: number }[] {
  const completions = getMockAllCompletions();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts: Record<string, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * MS_PER_DAY);

  completions
    .filter(completion => new Date(completion.completed_at) >= sevenDaysAgo)
    .forEach(completion => {
      const date = new Date(completion.completed_at);
      counts[days[date.getDay()]] += 1;
    });

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getTime() - (6 - index) * MS_PER_DAY);
    const dayName = days[date.getDay()];
    return { x: dayName, y: counts[dayName] };
  });
}