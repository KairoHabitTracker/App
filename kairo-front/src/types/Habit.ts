export type Habit = {
    id: number;
    name: string;
    emoji: string;
    hex_color: string;
    category:
        | 'health'
        | 'sport'
        | 'work'
        | 'chores'
        | 'commitments'
        | 'physical_wellbeing'
        | 'mental_wellbeing'
        | 'social'
        | 'financial'
        | 'hobbies'
        | 'learning'
        | 'productivity'
        | 'bad_habit'
        | 'other';
    created_at: string | null;
    updated_at: string | null;
};