import {Habit} from "@/src/types/Habit";
import {UserHabit} from "@/src/types/UserHabit";

export type HabitsContextType = {
    habits: Habit[];
    loading: boolean;
    error: string | null;
    refreshHabits: () => Promise<void>;
    getHabitById: (id: string | number) => Habit | undefined;
    userHabits: UserHabit[];
    fetchUserHabits: () => Promise<void>;
    getUserHabitById: (userHabitId: string | number) => UserHabit | undefined;
};
