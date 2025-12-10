import {useLocalSearchParams} from 'expo-router';
import HabitForm from '@/src/components/habit/HabitForm';

export default function AddHabitScreen() {
    const {habitId} = useLocalSearchParams() as { habitId: string };

    return (
        <HabitForm
            mode="add"
            habitId={habitId}
        />
    );
}