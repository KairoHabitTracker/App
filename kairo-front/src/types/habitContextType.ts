import {Habit} from "@/src/types/Habit";
import {UserHabit} from "@/src/types/UserHabit";

export interface HabitsContextType {
    habits: Habit[];
    userHabits: UserHabit[];
    loading: boolean;
    error: string | null;
    refreshHabits: () => Promise<void>;
    fetchUserHabits: () => Promise<void>;
    getHabitById: (id: string | number) => Habit | undefined;
    getUserHabitById: (userHabitId: string | number) => UserHabit | undefined;
    completeHabit: (habitId: number) => Promise<void>;
    uncompleteHabit: (habitId: number) => Promise<void>;
    addHabit: (payload: any) => Promise<void>;
    editHabit: (userHabitId: string, payload: any) => Promise<void>;
}
