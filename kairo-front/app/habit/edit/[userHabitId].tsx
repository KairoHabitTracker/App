import {useLocalSearchParams} from 'expo-router';
import HabitForm from '@/src/components/habit/HabitForm';

export default function EditHabitScreen() {
    const {userHabitId} = useLocalSearchParams() as { userHabitId: string };

    return (
        <HabitForm
            mode="edit"
            userHabitId={userHabitId}
        />
    );
}