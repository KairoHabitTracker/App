import {Stack} from 'expo-router';
import BackButton from "@/src/components/BackButton";

export default function HabitLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="add/index"
                options={{
                    title: 'Add Habit',
                    presentation: 'card',
                    headerLeft: () => <BackButton/>,
                }}
            />

            <Stack.Screen
                name="add/[habitId]"
                options={{
                    title: 'Habit Details',
                }}
            />

            <Stack.Screen
                name="edit/[userHabitId]"
                options={{
                    title: 'Edit Habit',
                    headerLeft: () => <BackButton/>,
                }}
            />

            <Stack.Screen
                name="all/index"
                options={{
                    title: 'My Habits',
                    headerLeft: () => <BackButton/>,
                }}
            />
        </Stack>
    );
}
