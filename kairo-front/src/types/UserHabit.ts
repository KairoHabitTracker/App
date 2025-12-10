import {Habit} from "@/src/types/Habit";

export type UserHabit = {
    id: number;
    user_id: number;
    habit_id: number;
    streak: number;
    notification_time: string | null;
    days_of_week: string[] | null;
    start_date: string | null;
    end_date: string | null;
    last_completed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    habit: Habit
};