import {Habit} from "@/src/types/Habit";

export type HabitsContextType = {
    habits: Habit[];
    loading: boolean;
    error: string | null;
    refreshHabits: () => Promise<void>;
    getHabitById: (id: string | number) => Habit | undefined;
    userHabits: Habit[];
};
