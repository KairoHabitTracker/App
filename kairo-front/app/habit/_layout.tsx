import {Stack} from 'expo-router';
import BackButton from "@/src/components/BackButton";
import {useThemeMode} from '@/src/contexts/ThemeContext';

export default function HabitLayout() {
    const {colors} = useThemeMode();
    return (
        <Stack
            screenOptions={{
                headerStyle: {backgroundColor: colors.background},
                headerTintColor: colors.text,
                headerTitleStyle: {color: colors.text},
            }}
        >
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
